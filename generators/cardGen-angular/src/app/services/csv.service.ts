import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { defer, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mapper } from '../mappers/mapper';
import { CardConstants } from '../mainVariables';

@Injectable({
	providedIn: 'root',
})
export class CsvService {
	public cardConst: CardConstants = new CardConstants();
	actions$: Observable<Action[][]> | undefined;
	equipments$: Observable<Equipment[][]> | undefined;
	usables$: Observable<Usable[][]> | undefined;
	mapper: Mapper = new Mapper();
	constructor() {
		if (this.localEquipmentCsv) {
			this.equipments$ = of(
				this.castToEquipmentArray(this.localEquipmentCsv)
			);
		} else {
			this.equipments$ = defer(() => from(this.getEquipmentCSV()));
		}
		if (this.localUsablesCsv) {
			this.usables$ = of(this.castToUsableArray(this.localUsablesCsv));
		} else {
			this.usables$ = defer(() => from(this.getUsableCSV()));
		}

		if (this.localActionsCsv) {
			this.actions$ = of(this.castToActionsArray(this.localActionsCsv));
		}
	}

	getActionsCSV() {}

	getEquipmentCSV() {
		const octokit = new Octokit({
			auth: environment.github,
		});

		return octokit
			.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: 'Hobatron',
				repo: 'TTS-CardGenerator',
				path: 'generators/cardGen-angular/equipmentCsv.csv',
				mediaType: {
					format: 'raw',
				},
			})
			.then((value) => {
				return this.castToEquipmentArray(value.data as any);
			});
	}

	getUsableCSV() {
		const octokit = new Octokit({
			auth: environment.github,
		});

		return octokit
			.request('GET /repos/{owner}/{repo}/contents/{path}', {
				owner: 'Hobatron',
				repo: 'TTS-CardGenerator',
				path: 'generators/cardGen-angular/usablesCsv.csv',
				mediaType: {
					format: 'raw',
				},
			})
			.then((value) => {
				return this.castToUsableArray(value.data as any);
			});
	}

	private castToActionsArray(glob: string): any {
		let actions: Action[][] = [[]];

		if (glob) {
			let rows = glob.split('\n');
			delete rows[0]; // deletes headers
			rows = rows.flatMap((item) => [item, item, item, item]);
			let rowItterator = 0;
			let pageItterator = 0;
			rows.forEach((row) => {
				const logging = row.includes('111');
				if (this.cardConst.cols == 3 && rowItterator == 9) {
					pageItterator++;
					actions[pageItterator] = [];
					rowItterator = 1;
				} else {
					rowItterator++;
				}
				let type = (row.match(/(?<=\[)(.*?)(?=\])/g) as any)[0]; // returns anything in [] i.e. [Attack/Mine]
				let rules = row
					.split(']')
					[row.split(']').length - 1].replace(/\\/g, ''); // returns everything after any []
				actions[pageItterator].push({
					type,
					rules,
				});
			});
		}
		return actions;
	}

	private castToUsableArray(glob: string): any {
		let usables: Usable[][] = [[]];

		if (glob) {
			const rows = glob.split('\n');
			delete rows[0]; // deletes headers
			let rowItterator = 0;
			let pageItterator = 0;
			rows.forEach((row) => {
				const logging = row.includes('111');
				if (this.cardConst.cols == 3 && rowItterator == 9) {
					pageItterator++;
					usables[pageItterator] = [];
					rowItterator = 1;
				} else {
					rowItterator++;
				}

				const cols = row.match(/(\\.|[^,])+/g);
				if (cols?.length && cols?.length <= 2) {
					let type = cols[0].match(/(?<=\[)(.*?)(?=\])/g) as any; // returns anything in [] i.e. [Attack/Mine]
					let name = cols[0].match(/(?<=\|)(.*?)(?=\|)/g) as any; // returns anything in || i.e. |My Magic Item|
					let noTypes =
						cols[0].split(']')[cols[0].split(']').length - 1]; // returns everything after any []

					let rules =
						noTypes?.split('|')[noTypes.split('|').length - 1]; // returns everything after any ||
					let slot = cols[1];
					const usable = {
						slot: this.mapper.cost(slot),
						name: name ? name[0] : undefined,
						rules: rules.replace(/\\/g, ''),
						type: type ? type[0] : undefined,
					};

					if (logging) {
						console.log(usable);
					}
					usables[pageItterator].push(usable);
				}
			});
		}
		return usables;
	}

	private castToEquipmentArray(glob: string): any {
		let equipment: Equipment[][] = [[]];
		if (!glob) {
			throw new Error('The file existed, but it seems empty');
		}
		const rows = glob.split('\n');
		if (rows[0] !== 'Text,Cost') {
			console.error(
				'Impropper equipment headers in equipmentCsv.csv: ',
				rows[0]
			);
		}
		delete rows[0];
		let rowItterator = 0;
		let pageItterator = 0;
		rows.forEach((row) => {
			if (this.cardConst.cols == 3 && rowItterator == 9) {
				pageItterator++;
				equipment[pageItterator] = [];
				rowItterator = 1;
			} else {
				rowItterator++;
			}
			const cols = row.match(/(\\.|[^,])+/g);
			if (cols?.length && cols?.length <= 2) {
				const equip = this.mapToEquipment(cols[0], cols[1]);
				if (equip.type?.toLowerCase().includes('xxx')) {
					console.log(equip);
				}
				equipment[pageItterator].push(equip);
			} else if (cols != null) {
				console.error(
					'Invalid columns, check for unescaped commas: ',
					cols
				);
				throw new Error('');
			}
		});
		return equipment;
	}

	private mapToEquipment(rules: string, costs: string): Equipment {
		//Might be better to add cols to the csv rather than using regex here
		let type = rules.match(/(?<=\[)(.*?)(?=\])/g) as any; // returns anything in [] i.e. [Attack/Mine]
		let name = rules.match(/(?<=\|)(.*?)(?=\|)/g) as any; // returns anything in || i.e. |My Magic Item|
		let noTypes = rules.split(']')[rules.split(']').length - 1]; // returns everything after any []
		rules = noTypes?.split('|')[noTypes.split('|').length - 1]; // returns everything after any []
		let cost = this.mapper.cost(costs);
		return {
			cost: cost,
			name: name ? name[0] : undefined,
			rules: rules.replace(/\\/g, ''),
			type: type ? type[0] : undefined,
		} as Equipment;
	}

	localEquipmentCsv = ``;

	localUsablesCsv = ``;

	localActionsCsv = `rules,
[Craft/Trade] Craft: Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. :N:N Trade: Gain 0/1/1/2 {Gem:R} based on Slot Level 1/2/3/4+. Then you may sell Gems to Gain 2 {Gold:} or Draw 1 Consumable Card for each gem.
[Move] Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] Discover: Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. :N:N Use: Play a One Use Consumable card from your hand.
[Attack/Mine] Attack: Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. :N:N Mine: Gain Slot Level {Gold:}. If you are on a Rich Mine\\, also roll three dice. Gain {Gold} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}
[Melee Attack/Prepare] Melee Attack: Gain 1 movement point. Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. :N:N Prepare: Gain Slot Level and distribute them amongst your action cards. Maximum of two can be on each card.
[Move] Move: Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] Discover: Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. :N:N Use: Play a One Use Consumable card from your hand.
[Ranged Attack/Trade] Ranged Attack: Target an enemy range Slot Level away. Roll up to Slot Level dice. Deal damage equal to the number of {Dice:Hit} +1. If you roll any {Dice:Miss}\\, deal 0 damage instead. :N:N Trade: Gain 0/1/1/2 {Gem:R} based on Slot Level 1/2/3/4+. Then you may sell Gems to Gain 2 {Gold:} or Draw 1 Consumable Card for each gem.
[Craft/Mine] Craft: Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. :N:N Mine: Mine only on a Rich Vein: Roll Slot Level dice. Gain {Gold:} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}`;
}

export interface Icon {
	type: 'gem' | 'gold' | 'slot level' | 'dice';
	value: string;
}

export interface Equipment {
	cost: Icon[] | undefined;
	name: string | undefined;
	type: string | undefined;
	rules: string | undefined;
}

export interface Usable {
	name: string | undefined;
	slot: Icon[] | undefined;
	type: string | undefined;
	rules: string | undefined;
}

export interface Action {
	type: string | undefined;
	rules: string | undefined;
}
