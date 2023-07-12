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

	localEquipmentCsv = `Text,Cost
	[Passive] | Stun Powder | Whenever you Attack and deal 3 or less damage: You may spend {Gem:R} to stun your target.,{Gold:2}
[Passive] |Liquid Shield| +1 Armor :N When an opponent rolls one or more {Dice:Crit} while attacking you - you may spend {Gem:R} to turn one into {Dice:Miss}. (This does not cause Ranged Attacks to fail.),{Gold:5}
[Passive] |Spike Armor| +1 Armor. :N When you roll one or more {Dice:!} - Deal 1 damage to an enemy within range 1.,{Gold:6}
[Passive] |Anklets of The Wind| +1 Move. :N When you roll one or more {Dice:!} you may use it to Move 1,{Gold:3}
[Passive] |Sure-Footed Greaves| +1 Move. :N When you roll {Dice:!} you may spend one to put a +1 Counter on one of your Action Cards.,{Gold:4}
[Upgrades Move] |Swift Boots|+2 Move. :N You cannot use heals on the map.,{Gold:5}
[Passive] |Silver Coating| +1 Melee Attack. :N Deal 1 extra damage whenever you Attack a monster.,{Gold:3}
[Passive] |Vorpal Blade|+1 Melee Attack. :N When you roll one or more {Dice:!} while attacking you may spend one of them to deal 1 extra damage.,{Gold:5}
[Passive] |Longbow| +2 Ranged Attack. :N You may ignore up to 1 {Dice:Miss} when you roll.,{Gold:6}
[Passive] |Mr Fusion|Once per turn before you take either of your actions: You may discard an Equipment or Consumable card to move any action to Slot Level 4.,{Gold:3}
[Passive] |Unlocked Potential| This card acts as an extra Action Card. It starts in the highest position. You may use it as though it were any other Action Card but still move this card. When you do: treat the Slot Level as 2. (This does benefit from +1 Action effects.),{Gold:4}
[Upgrades Move] |Zagreus Feet| You are immune to lava. When you roll one or more {Dice:!} you may spend one to inflict Burn on an enemy within range 1.,{Gold:3}
[Passive] |Qi Control| End of turn: You may swap your 2nd and 3rd slots.,{Gold:8}
[Passive] |Frost Armor| +1 Armor (Armor allows you to roll 1 hit die whenever you take damage to reduce the damage.) :N Enemies within range 3 of you have Move -1.,{Gold:5;Gem:R}
[Passive] |Fragile Pendant|You may use this when you activate an Action Card to give it Slot Level+2 for that use. Cannot exceed Slot Level 5. Fragile (Item is returned to reserve after each use.),{Gold:2}
[Passive] |Ankh of Reincarnation|The next time you would die instead your health is 5 and this item is destroyed.,{Gold:5}
[Passive] |Aura of Decay| After a Player Attacks you: Inflict Weak and Feeble. :N When you end your turn adjacent to an enemy: inflict Weak OR Feeble.,{Gold:6}
[Passive] |Light Weight Pack| When you activate the Use action you may move 1 first.,{Gold:3}
[Passive] |Whetstone| +1 Melee Attack and +1 Ranged Attack,{Gold:4}
[Passive] |Blunt Instrument| +2 Melee Attack. -1 Ranged Attack. :N When you roll 1 or more {Dice:!} while attacking: you may inflict Daze.,{Gold:5}
[Upgrades Ranged Attack/Trade] |Explosive Arrows| +1 Ranged Attack. :N When you roll one or more {Dice:!} you may ignore all {Dice:Miss} this roll. :N You may spend {Gem:R} to inflict 2 additional damage to your target and all adjacent targets.,{Gold:8;Gem:R}
[Passive] |Saltpeter|Your damage dealing consumeable items deal +2.,{Gold:4}
[Upgrades Ranged Attack/Trade] |Strongbow| +1 Ranged Attack. +1 Range. :N When you use this action to roll one or more {Dice:!} and no {Dice:Miss} you may spend {Gem:R} to inflict Stun.,{Gold:5}
[Passive] |Toxic Oil|+1 Melee Attack :N Inflict {Dice:!} Poison to your target when you roll dice to attack.,{Gold:6}
[Upgrades Attack/Prepare] |Flaming Sword| +1 Melee Attack :N When you roll one or more {Dice:!} while Melee Attacking you may inflict Burn.,{Gold:4}
[Passive] |Scavenging|+1 Discover and +1 Use.,{Gold:6}
[Passive] |Acrobatics| You may use any Slot Level 4+ Action Card as though it was any of your other Action Cards. If you do: Treat it as Slot Level 2. (This does benefit from +1 Action effects.),{Gold:4}
[Passive] |Vampire Fangs|+1 Melee Attack. :N When you roll {Dice:!} you may spend up to 2 to heal 1 for each.,{Gold:5}
[Upgrades Move] |Running Shoes| +2 Move. Mountains cost you 3 movement points to step onto. (Instead of 2.),{Gold:2}
[Passive] |Sniper Sight| +2 Ranged Attack. -1 Melee Attack. :N You may reroll up to 2 dice when you Ranged Attack. (This can reroll the same die twice.),{Gold:6}
[Passive] |Heavy Club| +1 Melee Attack. :N When you roll {Dice:!} while attacking you may spend them as Move controlling your target. They must be further away from you after each move. (Follow Terrain rules.),{Gold:5}
[Passive] |Backpack|+1 Use. :N May carry two extra Consumable items. (Capacity increased from 3 to 5.),{Gold:3}
[Passive] |Bag of Holding|When you roll two or more {Dice:!} in a single roll: You may draw a Consumable item. May carry two extra Consumable items. (Capacity increased from 3 to 5.),{Gold:6;Gem:R}
[Passive] |Enchanted Weapons| Treat all {Dice:Miss-Crit} as {Dice:!},{Gold:4;Gem:R}
[Upgrades Move] |Wings| You may ignore all terrain. (This allows you to walk on Water\\, traverse Mountains freely\\, and take no damage from Lava.),{Gold:3}
[Passive] |Kevlar Armor| When you are about to take 5 or more damage from a single source: You get +2 Armor until end of turn. (You may roll these dice now even if you already rolled Armor.) Can only activate once per turn.,{Gold:6}
[Passive] |Absorbing Armor| +1 Armor. :N When you roll one or more {Dice:!} while defending you may Heal 1 for each.,{Gold:5}
[Passive] | Optimized Magic | Your Slot Level 4 is treated as Slot Level 5.,{Gold:7}
[Passive] | Mirror Force | Deal X-1 damage to an enemy when they Attacks you. X is equal to your current Move action card Slot Level.,{Gold:9}
[Passive] | Rage Aura | Once per roll turn a {Dice:Miss} into {Dice:Crit},{Gold:4;Gem:R}
[Passive] | Hover Boots | +1 Armor. :N You may ignore all terrain. (This allows you to walk on Water\\,traverse Mountains freely\\,and take no damage from Lava.),{Gold:9}
[Upgrades Discover/Use] |Robotic Arm| When you take the Use action you may repeat it once at the same Slot Level.,{Gold:9}
[Upgrades Melee Attack/Prepare] |Glass Spear| Stun the target of your Melee Attack. +2 Slot Level if used in Slot Level 4. Fragile (Item is returned to reserve after each use.),{Gold:2}
[Upgrades Discover/Use] |Bottomless Satchel| At the start of your turn: Draw a Consumable card.,{Gold:8;Gem:R}
[Upgrades Melee Attack/Prepare] |Halberd of Guan Yu| +1 Prepare. +2 Melee Attack. Your Melee Attack can hit enemies Range 2 away. When you Melee Attack and roll 2 or more {Dice:!}: You may spend them to attack all enemies within Range 2 instead of just your target.,{Gold:6;Gem:R;}
[Upgrades Move] | Phasing Boots | Move +3. You can move through players as long as you don't end your move in the same hex. When you do this; you deal 1 to them.,{Gold:7}
[Upgrades Discover/Use] | Freezing Tincure | +1 Use. :N Your Consumable items that effect enemies also Stun one of them. (Your choice if multiple.) Fragile (Item is returned to reserve after each use.),{Gold:3}
[Upgrades Move] | Rocket Boots | +1 Move :N {Gem:R} : +3 Move,{Gold:4}
[Upgrades Discover/Use] | Quick-Access Belt |When Crafted: you may pay {Gem:R}. If you do: draw 2 cards from the Consumable deck and keep them. :N +2 Use. :N Play with your Consumable cards revealed.,{Gold:6}
[Passive] | Pandora' s Box | When you buy this: You draw and must equip the top two cards from the Equipment deck. Then lose life equal to the total {Gold:1} cost -8. Fragile (Item is returned to reserve after each use.),{Gold:8}
[Passive] | Lava Hammer | {Gem:R} : Melee Attack +3. :N When you roll one or more {Dice:!} while attacking - inflict burn.,{Gold:4}
[Passive] | Mental Enhancement | +1 Discover. :N After you resolve the Use Action you may shift your Move Card to any Slot Level.,{Gold:4}
[Upgrades Craft/Mine] |Pickaxe| +1 Mine. :N When you roll 1 or more {Dice:!} you may spend one of them to gain {Gem:R}.,{Gold:5}
[Upgrades Melee Attack/Prepare] | Brawlers Gauntlets | You can move onto a hex with an enemy. Enemies you share a hex with can't Attack you. When an enemy attempts to leave a hex you share: Melee Attack them first.,{Gold:10}
[Upgrades Move] |Gadget Boots|+1 Move. +1 Use. :N Once per turn: you may Stun yourself to take an additional action. This additional action must be a Move or a Use. :N You may use this card as though it were a Use action card.,{Gold:10}
[Upgrades Melee Attack/Prepare] | Poison Dagger | +1 Prepare. :N You may pay {Gem:R} when you Attack to inflict poison instead of damage. (Decide before rolling dice.),{Gold:7}
[Passive] |Meditation Stance| +1 Prepare. :N When you roll one or more {Dice:Miss} you may reroll 1 die.,{Gold: 4}
[Upgrades Discover/Use] |Dangerous Chemicals|When you roll two or more {Dice:!} in a single roll during your turn - you may take a Use action using this card after finishing that action.,{Gold:6}`;

	localUsablesCsv = `Text,Slot,
[One use] | Instant Transmission | Choose a hex within Range 3. Teleport to that hex. Then you may take another action., {Slot Level: 1+}
[One use] | Magnetic Attraction | Gain all Gem bonuses on hexes within 3 range. Then you may teleport to a hex with an unused bonus within Slot Level range.,
[One use] | Remote Mining | Use all Mines within Slot Level range. For each: Roll 2 dice and gain a {Gold:1} per {Dice:Hit} and a gem per {Dice:!}.,
[One use] | Springboard | Choose a space within range 5. Teleport to that space.,{Slot Level: 2+}
[One use] | Attune with Nature | Explore any number of adjacent tiles. Use all Gem and Health rewards on those tiles., {Slot Level: 3+}
[One use] | Snipe | Range Slot Level +2. Deal 3 damage.,
[One use] | Snipe | Range Slot Level +2. Deal 3 damage.,
[One use] | Vamparic Attack | Range 1. Attack with Slot Level +1 dice. Heal Slot Level.,
[One use] | Vamparic Attack | Range 1. Attack with Slot Level +1 dice. Heal Slot Level.,
[One use] | Vamparic Attack | Range 1. Attack with Slot Level +1 dice. Heal Slot Level.,
[One use] | Poison Gas | Range 3 poison all enemies Slot Level -1.,
[One use] | Ki Blast | Range 2 Slot Level damage. You may spend {Gem:R} to add 2 damage up to twice.,
[One use] | Poison Dart | Range Slot Level. Poison 3.,
[One use] | Napalm Dart | Range Slot Level. Inflict Burn and Weak.,
[One use] | Full Restore | Fully Heal and remove all Status Effects., {Slot:5+}
[One use] | Bloodlust | Randomly pick an opposing player. Teleport to any hex adjacent to them. Then you may use an Attack action card as part of this action without moving it's card.,
[One use] | Bottled Lightning | Hit all adjacent hexes. Damage equals Slot Level + 2.,
[One use] | Bottled Lightning | Hit all adjacent hexes. Damage equals Slot Level + 2.,
[One use] | Cannon Shot | Range 5 deal 5 damage to one target., {Slot Level: 5+}
[One use] | Makeshift Catapult | Range equals level. Roll 4 dice. Deal {Dice:Hit} damage.,
[One use] | Makeshift Catapult | Range equals level. Roll 4 dice. Deal {Dice:Hit} damage.,
[One use] | Makeshift Catapult | Range equals level. Roll 4 dice. Deal {Dice:Hit} damage.,
[One use] | Magic Missile | 5 range. Deal Slot Level damage.,
[One use] | Magic Missile | 5 range. Deal Slot Level damage.,
[One use] | Napalm | 5 range inflict Burn and Daze., {Slot Level: 3+}
[One use] | Power Potion | Immediately take another action. It's Slot Level is increased by 2., {Slot Level: 3+}
[One use] | Power Potion | Immediately take another action. It's Slot Level is increased by 2., {Slot Level: 3+}
[One use] | Overload | Range 3. Deal Slot Level +2 damage. Deal Slot Level -2 damage to yourself.,
[One use] | Overload | Range 3. Deal Slot Level +2 damage. Deal Slot Level -2 damage to yourself.,
[One use] | Grenade | Range 2. Deal damage equal to Slot Level to target hex and all adjacent hexes.,
[One use] | Grenade | Range 2. Deal damage equal to Slot Level to target hex and all adjacent hexes.,
[One use] | Full Restore | Fully Heal and remove all Status Effects., {Slot Level:4+}
[One use] | High Potion | Heal Slot Level x2 then take another action.,
[Trigger] | Antidote | Play at the end of your turn. Heal all status ailments.,
[Trigger] | Antidote | Play at the end of your turn. Heal all status ailments.,
[Trigger] | Antidote | Play at the end of your turn. Heal all status ailments.,
[Trigger] | Strong Consitution | When you would be inflicted with a status effect you may discard this instead.,
[Trigger] | Illusionary Armor | When you would are attacked you may discard this and move 1 first. (This can make the attack fail due to insufficient range.),
[One use] | Poison Arrow | Range 3. Inflict Slot Level Poison,
[One use] | Agile Strike | Move Slot Level then deal 2 damage to an adjacent enemy. (Ignoring all Armor.),
[One use] | Blast Mining | Gain Slot Level+2 {Gold:1}.,
[One use] | Poison Dagger | Range 1. Inflict Slot Level Poison. You may spend {Gem:R} to Attack with two dice up to twice.,
[One use] | Mortar and Pestle | Spend up to Slot Level gems. For each do one of the following and you may choose the same option more than once. Move 2. Attack 2. Draw a Consumable card.
[One use] | Mortar and Pestle | Spend up to Slot Level gems. For each do one of the following and you may choose the same option more than once. Move 2. Attack 2. Draw a Consumable card.
[One use] | Poison Vial | Your next attack this turn inflicts poison instead of damage. Then you may take an Attack action., {Slot Level: 3}
[Trigger] | Lucky Shot | When you roll one or more {Dice:Miss} you may discard this to treat any number of those as {Dice:Hit} instead.,
[Trigger] | Meditation | At the beginning of your turn you may discard this and rearrange your focus bar.,
[Immediate]	| Trade Contact | Buy any number of {Gem:R} for {Gold:1} each.
[Immediate]	| Coins | Gain 2 {Gold:},
[Immediate]	| Coins | Gain 2 {Gold:},
[Immediate]	| Bandaid | Heal 4,
[Immediate]	| Bandaid | Heal 4,
[Trigger] | Rage Buff | You may discard this when you deal damage. Attack 3 as additional damage.,
[Immediate] | Blessing of Iron | You may take a Mine action immediately. (This moves the appropriate card.),
[Immediate]	| Merchant's Favor | Reserve any 1 Equipment from the Market. (Reserved items can only be purchased by the player who owns them and cost 2 less.),
[Immediate]	| Chemical Acceleration | Move up to 4 ignoring all terrain. Cannot end this movement on Water. ,
[Immediate]	| Gambler's Dice | Roll 3 dice. On 3+ {Dice:Hit} gain 4 {Gold:}.,
[Immediate]	| Hidden Gems | Gain 2 {Gem:R}.,
[One Use] | Enfeeblement | Range 3. Inflict Feeble. Then Ranged Attack Slot Level. (With your Use Slot Level.)
[Trigger] | Private Auction | Discard after a player Crafts an equipment. Discard and replace any number of cards from the Equipment Market. Then Reserve 1 Equipment.`;

	localActionsCsv = `rules,
[Craft/Trade] Craft: Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. :N:N Trade: Gain 0/1/1/2 {Gem:R} based on Slot Level 1/2/3/4+. Then you may sell Gems to Gain 2 {Gold:} or Draw 1 Consumable Card for each gem.
[Move] Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] Discover: Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. :N:N Use: Play a One Use Consumable card from your hand.
[Attack/Mine] Attack: Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. :N:N Mine: Gain Slot Level {Gold:}. If you are on a Rich Mine\\, also roll three dice. Gain {Gold} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}
[Melee Attack/Prepare] Melee Attack: Gain 1 movement point. Target an enemy range one away. Roll Slot Level dice. Deal damage equal to the number of {Dice:Hit} to your target. :N:N Prepare: Gain Slot Level and distribute them amongst your action cards. Maximum of two can be on each card.
[Move] Move: Gain Slot Level movement points. You may spend 1 movement point to move across one border or explore 1 new tile which must border the space you are in.
[Discover/Use] Discover: Look at the top Slot Level cards of the Consumable deck. Keep one. Discard the others. If you are on a Scrap Pile keep up to two instead and use it up. :N:N Use: Play a One Use Consumable card from your hand.
[Ranged Attack/Trade] Ranged Attack: Target an enemy range Slot Level away. Roll up to Slot Level dice. Deal damage equal to the number of {Dice:Hit} +1. If you roll any {Dice:Miss}\\, deal 0 damage instead. :N:N Trade: Gain 0/1/1/2 {Gem:R} based on Slot Level 1/2/3/4+. Then you may sell Gems to Gain 2 {Gold:} or Draw 1 Consumable Card for each gem.
[Craft/Mine] Craft: Craft up to one item from the market. Cost is reduced by Slot Level. Level 4+: You may discard and replace any number of market items before crafting. :N:N Mine: Mine only on a Rich Vein: Roll Slot Level dice. Gain {Gold:} for each {Dice:Hit}. Gain {Gem:R} for each {Dice:!}
[Move]
[Discover/Use]
[Attack/Mine]
[Reserve/Craft]
[Craft/Trade]`;
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
