import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { defer, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mapper } from '../mappers/mapper';

@Injectable({
	providedIn: 'root',
})
export class CsvService {
	equipments$: Observable<Equipment[]> | undefined;
	usables$: Observable<Usable[]> | undefined;
	mapper: Mapper = new Mapper();
	constructor() {
		this.equipments$ = defer(() => from(this.getEquipmentCSV()));
		this.usables$ = defer(() => from(this.getUsableCSV()));
	}

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

	private castToUsableArray(glob: string): any {
		let usables: Usable[] = [];

		if (glob) {
			const rows = glob.split('\n');
			delete rows[0]; // deletes headers
			rows.forEach((row) => {
				const cols = row.match(/(\\.|[^,])+/g);
				if (cols?.length && cols?.length <= 2) {
					let type = cols[0].match(/(?<=\[)(.*?)(?=\])/g) as any; // returns anything in [] i.e. [Attack/Mine]
					let name = cols[0].match(/(?<=\|)(.*?)(?=\|)/g) as any; // returns anything in || i.e. |My Magic Item|
					let noTypes =
						cols[0].split(']')[cols[0].split(']').length - 1]; // returns everything after any []
					let rules =
						noTypes?.split('|')[noTypes.split('|').length - 1]; // returns everything after any ||
					let slot = cols[1];

					usables.push({
						slot: this.mapper.cost(slot),
						name: name ? name[0] : undefined,
						rules: rules.replace(/\\/g, ''),
						type: type ? type[0] : undefined,
					});
				}
			});
		}
		return usables;
	}

	private castToEquipmentArray(glob: string): any {
		let equipment: Equipment[] = [];
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
		rows.forEach((row) => {
			const cols = row.match(/(\\.|[^,])+/g);
			if (cols?.length && cols?.length <= 2) {
				equipment.push(this.mapToEquipment(cols[0], cols[1]));
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
}

export interface Icon {
	type: 'gem' | 'gold' | 'slot' | 'dice';
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
