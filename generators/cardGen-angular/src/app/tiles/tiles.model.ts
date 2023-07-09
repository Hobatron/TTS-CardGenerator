export enum Terrain {
	None,
	Water,
	RoughTerrain,
	Lava,
}

export enum Bonus {
	None,
	Teleport,
	Monster,
	Discover,
	Mine,
	Heal,
	Gem,
}

export class Hex {
	terrain: Terrain = Terrain.None;
	bonus: Bonus = Bonus.None;
}

export class Tile {
	aMountainCheck = false;
	hexes: Hex[];
	currentWeight = 0;
	currentPropertyCount = 0;
	isTeleporter: any;
	isMonster: any;

	private weightValues = {
		water: -0.8,
		lava: -1,
		roughTerrain: -0.55,
		teleporter: 0.25,
		monster: 1.5,
		discover: 2,
		mine: 1.5,
		heal: 0.5,
		gem: 1,
	};
	private propertyTotalMinimum = 4;
	private stopGenerating = 0;

	constructor(isTeleporters: boolean, isMonsters: boolean) {
		this.isTeleporter = isTeleporters;
		this.isMonster = isMonsters;
		this.hexes = [new Hex(), new Hex(), new Hex(), new Hex()];
		this.generateRandomTile();
	}

	private generateRandomTile(): void {
		//While the tile:
		//Has a valid number of properties
		//weight between 1.5 and 2.5
		//1 or less mine tiles
		while (
			this.stopGenerating < 1000 &&
			(this.currentPropertyCount <= this.propertyTotalMinimum - 1 ||
				!(this.currentWeight >= 1.5 && this.currentWeight <= 2.5) ||
				this.hexes.filter((h) => h.bonus == Bonus.Mine).length > 1)
		) {
			this.hexes = [new Hex(), new Hex(), new Hex(), new Hex()];
			this.currentWeight = 0;
			this.currentPropertyCount = 0;
			this.addBaseBonuses();
			for (let i = 0; i < this.hexes.length; i++) {
				const hex = this.hexes[i];
				if (hex.bonus != Bonus.Teleport && hex.bonus != Bonus.Monster) {
					this.randomizeValidHex(hex);
					this.increasePropCount(hex);
				}
			}
			this.stopGenerating++;
			if (this.stopGenerating == 1000) {
				console.log('a tile has failed');
			}
		}
		console.log(this);

		this.hexes = this.shuffleArray(this.hexes);
	}

	addBaseBonuses() {
		if (this.isTeleporter) {
			this.hexes[0].bonus = Bonus.Teleport;
		} else if (this.isMonster) {
			this.hexes[0].bonus = Bonus.Monster;
		}
		this.increasePropCount(this.hexes[0]);
	}

	private randomizeValidHex(hex: Hex) {
		let hexTerrain = Terrain.None;
		let hexBonus = Bonus.None;
		//half the time pick a terrain (half terrains have a chance to get a bonus [none/roughTerrain])
		if (Math.random() < 0.65) {
			hexTerrain = Math.floor(Math.random() * 4);
		}
		if (hexTerrain == Terrain.None || hexTerrain == Terrain.RoughTerrain) {
			//keep some tiles blank
			if (Math.random() < 0.4) {
				//Hex bonus CAN'T be teleport, none, or monster
				hexBonus = Math.floor(Math.random() * 4) + 3;
			}
		}
		hex.bonus = hexBonus;
		hex.terrain = hexTerrain;
	}

	increasePropCount(hex: Hex) {
		if (hex.bonus) {
			this.currentPropertyCount++;
		}
		if (hex.terrain) {
			this.currentPropertyCount++;
		}
		this.increaseCurrentWeight(hex);
	}

	increaseCurrentWeight(hex: Hex) {
		let weight = 0;

		switch (hex.terrain) {
			case Terrain.None:
				weight += 0;
				break;
			case Terrain.Water:
				weight += this.weightValues.water;
				break;
			case Terrain.RoughTerrain:
				weight += this.weightValues.roughTerrain;
				break;
			case Terrain.Lava:
				weight += this.weightValues.lava;
				break;
		}

		switch (hex.bonus) {
			case Bonus.None:
				weight += 0;
				break;
			case Bonus.Monster:
				weight += this.weightValues.monster;
				break;
			case Bonus.Discover:
				weight += this.weightValues.discover;
				break;
			case Bonus.Mine:
				weight += this.weightValues.mine;
				break;
			case Bonus.Gem:
				weight += this.weightValues.gem;
				break;
		}

		this.currentWeight += weight;
	}

	shuffleArray(hexes: Hex[]): Hex[] {
		for (let i = hexes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[hexes[i], hexes[j]] = [hexes[j], hexes[i]];
		}
		return hexes;
	}
}
