export enum Terrain {
	none,
	water,
	roughTerrain,
	lava,
}
export enum Bonus {
	none,
	monster,
	discover,
	mine,
	gem,
}
export class Hex {
	terrain: Terrain = Terrain.none;
	bonus: Bonus = Bonus.none;
}
export class Tile {
	_isTeleporter: boolean;
	_isMonster: boolean;
	hexs: Hex[];
	currentWeight = 0;
	tileWeightGoal = 2;
	wieghtMargin = 1.5;
	propertyTotalMinimum = 6; //total number of properties a tile can have + up to propertyTotalVariance
	propertyTotalVariance = 2;

	weightValues = {
		water: -1,
		lava: -2,
		roughTerrain: -1.25,
		teleporter: 0,
		monster: 1.5,
		discover: 2,
		mine: 1.5,
		heal: 0.5,
		gem: 1,
	};

	constructor(isTeleporter = false, isMonster = false) {
		this._isTeleporter = isTeleporter;
		this._isMonster = isMonster;
		this.hexs = this.generateHexes();
	}

	generateHexes(): Hex[] {
		let hexArray = [new Hex(), new Hex(), new Hex(), new Hex()];
		if (this._isTeleporter) {
			//teleporters are a property, but can't contain any hex bonuses/terrain
			hexArray.splice(1, 1);
			this.propertyTotalMinimum - 1;
		}
		if (this._isMonster) {
			hexArray[0].bonus = Bonus.monster;
			this.currentWeight += this.weightValues.monster;
			this.propertyTotalMinimum - 1;
		}
		const totalProps =
			this.propertyTotalMinimum +
			Math.floor(Math.random() * this.propertyTotalVariance);

		for (let i = 0; i < totalProps; i++) {
			if (this.currentWeight < this.tileWeightGoal) {
				const hex = this.selecetHexWithoutBonus(hexArray);
				if (hex) {
					this.addBonus(hex);
				} else {
					this.reduceTerrain(hexArray);
				}
			} else {
				const hex = this.selecetHexWithoutTerrain(hexArray);
				if (hex) {
					this.addTerrain(hex);
				}
			}
		}
		return hexArray;
	}

	addTerrain(hex: Hex) {
		hex.terrain = Math.floor(Math.random() * 3) + 1;
		switch (hex.terrain) {
			case Terrain.water:
				this.currentWeight += this.weightValues.water;
				break;
			case Terrain.roughTerrain:
				this.currentWeight += this.weightValues.roughTerrain;
				break;
			case Terrain.lava:
				this.currentWeight += this.weightValues.lava;
		}
	}

	addBonus(hex: Hex) {
		hex.bonus = Math.floor(Math.random() * 3) + 2;
		switch (hex.bonus) {
			case Bonus.discover:
				this.currentWeight += this.weightValues.discover;
				break;
			case Bonus.mine:
				this.currentWeight += this.weightValues.mine;
				break;
			case Bonus.gem:
				this.currentWeight += this.weightValues.gem;
		}
	}

	selecetHexWithoutTerrain(hexArray: Hex[]): Hex | null {
		let res = null;
		hexArray.forEach((hex) => {
			if (
				hex.terrain == Terrain.none &&
				hex.bonus != Bonus.monster &&
				hex.bonus != Bonus.gem &&
				hex.bonus != Bonus.mine &&
				hex.bonus != Bonus.discover
			) {
				res = hex;
			}
		});
		return res;
	}
	selecetHexWithoutBonus(hexArray: Hex[]): Hex | null {
		let res = null;
		hexArray.forEach((hex) => {
			if (
				hex.bonus == Bonus.none &&
				hex.terrain != Terrain.water &&
				hex.terrain != Terrain.lava
			) {
				res = hex;
			}
		});
		return res;
	}

	reduceTerrain(hexArray: Hex[]) {
		hexArray.every((hex) => {
			if (hex.terrain == Terrain.water || hex.terrain == Terrain.lava) {
				hex.terrain = Terrain.roughTerrain;
				return false;
			}
			return true;
		});
	}
}
