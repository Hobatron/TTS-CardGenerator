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
		let usables: Usable[][] = [[]];

		if (glob) {
			const rows = glob.split('\n');
			delete rows[0]; // deletes headers
			let rowItterator = 0;
			let pageItterator = 0;
			rows.forEach((row) => {
				const logging = row.includes('xxxx');
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

	localEquipmentCsv = `Text,Cost
[Passive] | Stun Powder | Whenever you Attack and deal 3 or less damage: You may spend {Gem:R} to stun your target.,{Gold:2}
[Passive] +1 Armor - When an opponent rolls one or more {Dice:Crit} while attacking you - you may spend {Gem:R} to turn one into {Dice:Miss},{Gold:4}
[Spike Armor] [Passive] +1 Armor. When you roll one or more {Dice:!} - Deal 1 damage to an enemy within range 1.,{Gold:6}
[Anklets of The Wind] [Passive] +1 Move - When you roll one or more {Dice:!} you may use it to Move 1,{Gold:3}
[Sure-Footed Greaves] [Passive] +1 Move. When you roll {Dice:!} you may spend one to put a +1 Counter on one of your Action Cards.,{Gold:4}
[Swift Boots] [Move Replacement] +2 Move - You cannot use heals on the map.,{Gold:5}
[Silver Coating] [Passive] +1 Melee Attack. Deal 1 extra damage whenever you Attack a monster.,{Gold:3}
[Vorpal Blade] [Passive] +1 Melee Attack - When you roll one or more {Dice:!} while attacking you may spend one of them to deal 1 extra damage.,{Gold:5}
[Longbow] [Passive] +2 Ranged Attack. You may ignore up to 1 {Dice:Miss} when you roll.,{Gold:6}
[Mr Fusion] [Passive] Once per turn before you take either of your actions: You may discard an Equipment or Consumable card to move any action to Slot Level 4.,{Gold:3}
[Unlocked Potential] [Passive] This card acts as an extra Action Card. It starts in the highest position. You may use it as though it were any other Action Card but still move this card. When you do\\, treat the Slot Level as 2.,{Gold:4}
[Zagreus Feet] [Move Replacement] You are immune to lava. When you roll one or more {Dice:!} you may spend one to inflict Burn on an enemy within range 1.,{Gold:3}
[Qi Control] [Passive] End of turn: You may swap your 2nd and 3rd slots.,{Gold:7}
[Frost Armor] [Passive] +1 Armor (Armor allows you to roll 1 hit die whenever you take damage to reduce the damage.) - Enemies within range 3 of you have their movement reduced by 1.,{Gold:5;Gem:R}
[Fragile Pendant] [Passive] You may use this when you activate an Action Card to give it Slot Level+2 for that use. Cannot exceed Slot Level 5. Fragile (Item is returned to reserve after each use.),{Gold:2}
[Ankh of Reincarnation] [Passive] The next time you would die instead your health is 5 and this item is destroyed,{Gold:5}
[Aura of Decay] [Passive] After a Player Attacks you: Inflict Weak and Feeble. When you end your turn next to an enemy: inflict Weak OR Feeble.,{Gold:3}
[Light Weight Pack] [Passive] When you activate the Use action you may move 1 first.,{Gold:3}
[Whetstone] [Passive] +1 Melee Attack and +1 Ranged Attack,{Gold:4}
[Blunt Instrument] [Passive] +2 Melee Attack. -1 Ranged Attack. When you roll 1 or more {Dice:!} while attacking\\, you may inflict Daze.,{Gold:5}
[Explosive Arrows] [Replaces Ranged Attack/Trade] +1 Ranged Attack. When you roll one or more {Dice:!} you may ignore all {Dice:Miss} this roll. You may spend {Gem:R} to inflict 2 additional damage to your target and all adjacent targets.,{Gold:7}
[Saltpeter] [Passive] Your damage dealing consumeable items deal +2.,{Gold:4}
[Strongbow] [Replaces Ranged Attack/Trade] +1 Ranged Attack - When you use this action to roll one or more {Dice:!} and no {Dice:Miss} you may spend {Gem:R} to inflict Stun.,{Gold:5}
[Toxic Oil] [Passive] +1 Melee Attack - Inflict {Dice:!} Poison to your target when you roll dice to attack.,{Gold:6}
[Flaming Sword] [Replaces Attack/Prepare] +1 Melee Attack - When you roll one or more {Dice:!} while Melee Attacking you may inflict Burn.,{Gold:4}
[Scavenging] [Passive] +1 Discover and +1 Use.,{Gold:6}
[Acrobatics] [Passive] You may use any Slot Level 4+ Action Card as though it was any of your other Action Cards. If you do: Treat it as Slot Level 2. (This does benefit from +1 Action Name effects.),{Gold:4}
[Vampire Fangs] [Passive] +1 Melee Attack - When you roll {Dice:!} you may spend any number to heal 1 for each.,{Gold:5}
[Running Shoes] [Replaces Move] +2 Move. Mountains cost you 3 movement points to step onto. (Instead of 2.),{Gold:2}
[Sniper Sight] [Passive] +2 Ranged Attack. -1 Melee Attack. You may reroll up to 2 dice when you Ranged Attack. (This can reroll the same die twice.),{Gold:5}
[Heavy Club] [Passive] +1 Melee Attack - When you roll {Dice:!} while attacking you may spend them as Move controlling your target. They must be further away from you after each move. (Follow Terrain rules.),{Gold:5}
[Backpack] [Passive] +1 Use. May carry two extra Consumable items. (Capacity increased from 3 to 5.),{Gold:3}
[Bag of Holding] [Passive] When you roll two or more {Dice:!} in a single roll: You may draw a Consumable item. May carry two extra Consumable items. (Capacity increased from 3 to 5.),{Gold:6}
[Passive] +1 Discover. +1 Use,{Gold:6}
[Enchanted Weapons] [Passive] Treat all {Dice:Miss-Crit} as {Dice:!},{Gold:4;Gem:R}
[Wings] [Replaces Move] You may ignore all terrain. (This allows you to walk on Water\\, traverse Mountains freely\\, and take no damage from Lava.),{Gold:3}
[Kevlar Armor] [Passive] When you are about to take 5 or more damage from a single source: You get +2 Armor until end of turn. (You may roll these dice now even if you already rolled Armor.) Can only activate once per turn.,{Gold:7}
[Absorbing Armor] [Passive] +1 Armor. When you roll one or more {Dice:!} while defending you may Heal 1 for each.,{Gold:5}
[Passive] | Optimized Magic | Your Slot Level 4 is treated as Slot Level 5.,{Gold:6}
[Passive] | Mirror Force | Deal X-1 damage to an enemy when they Attacks you. X is equal to your current Move action card Slot Level.,{Gold:9}
[Passive] | Rage Aura | Once per roll turn a {Dice:Miss} into {Dice:Crit},{Gold:4;Gem:R}
[Passive] | Hover Boots | +1 Armor. You may ignore all terrain. (This allows you to walk on Water\\, traverse Mountains freely\\, and take no damage from Lava.),{Gold:9}
[Robotic Arm] [Replaces Discover/Use] When you take the Use action you may repeat it once at the same Slot Level.,{Gold:8}
[Move] Teleport instead. (Teleport ignores all terrain and obstacles except the hex you end on.),{Gold:5}
[Glass Spear] [Replaces Melee Attack/Prepare] Stun. +2 Slot Level if used in Slot Level 4. Fragile (Item is returned to reserve after each use.),{Gold:2}
[Bottomless Satchel] [Replaces Discover/Use] At the start of your turn: Draw a Consumable card.,{Gold:6}
[Halberd of Guan Yu] [Replaces Melee Attack/Prepare] +1 Prepare. +2 Melee Attack. Your Melee Attack can hit enemies Range 2 away. When you Melee Attack and roll 2 or more {Dice:!}: You may spend them to attack all enemies within Range 2 instead of just your target.,{Gold:6;Gem:R;}
[Replaces Move] | Phasing Boots | Move +3. You can move through players as long as you don't end your move in the same hex. When you do this; you deal 1 to them.,{Gold:7}
[Replaces Discover/Use] | Freezing Tincure | Your Consumable items that effect enemies also Stun one of them. (Your choice if multiple.) Fragile (Item is returned to reserve after each use.),{Gold:3}
[Replaces Move] | Rocket Boots | +1 Move :N {Gem:R} : +3 Move,{Gold:4}
[Replaces Use/Discover] | Quick-Access Belt | When Crafted: you may pay {Gem:R}. If you do\\, draw 2 cards from the Consumable deck and keep them. +2 Use. Play with your Consumable cards revealed.,{Gold:6}
[Passive] | Pandora' s Box | When you buy this: You draw and must equip the top two cards from the Equipment deck. Then lose life equal to the total {Gold} cost -8. Fragile (Item is returned to reserve after each use.),{Gold:8}
[Passive] | Lava Hammer | {Gem:R} : Melee Attack +3. When you roll one or more {Dice:!} while attacking - inflict burn. ,{Gold:4}
[Passive] +1 Discover. After you resolve the Use Action you may shift your Move Card to any Slot Level.,{Gold:4}
[Pickaxe] [Replaces Craft/Mine] +1 Mine. When you roll 1 or more {Dice:!} you may spend one of them to gain {Gem:R}.,{Gold:5}
[Replaces Melee Attack/Prepare] | Brawlers Gauntlets | You can move onto a hex with an enemy. Enemies you share a hex with can't Attack you. When an enemy attempts to leave a hex you share: Melee Attack them first.,{Gold:10}
[Replaces Move] +1 Move. +1 Use. Once per turn: you may Stun yourself to take an additional action. This additional action must be a Move or a Use. You may use this card as though it were a Use action card.,{Gold:10}
[Replaces Melee Attack/Prepare] | Poison Dagger | +1 Prepare. You may pay {Gem:R} when you Attack to inflict poison instead of damage. (Decide before rolling dice.),{Gold:7}
[Meditation Stance] [Passive] +1 Prepare. When you roll one or more {Dice:Miss} you may reroll 1 die.,{Gold: 4}
[Dangerous Chemicals] [Replaces Discover/Use] When you roll two or more {Dice:!} in a single roll during your turn - you may take a Use action using this card after finishing that action.,{Gold:5}
[Craft/Trade] Craft: Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. :N Trade: Gain {Gold:1} Then you may sell Gems to Gain 2 Gold or Draw 1 Consumable Card for each gem.
[Move] Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] | Discover | Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. OR | Use | Play a One Use Consumable card from your hand.
[Attack/Mine] | Attack | Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. OR | Mine | Gain Slot Level {Gold:1}. If you are on a Rich Mine\\, also roll three dice. Gain {Gold} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}
[Melee Attack/Prepare] | Melee Attack | Gain 1 movement point. Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. OR | Prepare | Gain Slot Level and distribute them amongst your action cards. Maximum of two can be on each card.
[Move] Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] | Discover | Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. OR | Use | Play a One Use Consumable card from your hand.
[Ranged Attack/Trade] | Ranged Attack | Target an enemy range Slot Level away. Roll up to Slot Level dice. Deal damage equal to the number of {Dice:Hit} +1. If you roll any {Dice:Miss}\\, deal 0 damage instead. OR | Trade | Gain  Then you may sell Gems to Gain 2 Gold or Draw 1 Consumable Card for each gem.
[Craft/Mine] | Craft | Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. OR | Mine | Mine only on a Rich Vein: Roll Slot Level dice. Gain {Gold} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}
[Move],
[Discover/Use],
[Attack/Mine],
[Reserve/Craft],
[Move],
[Craft/Trade],
[Move],
[Discover/Use],
[Attack/Mine],`;

	localUsablesCsv = ``;
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
