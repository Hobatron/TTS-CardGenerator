import { Component } from '@angular/core';
import { Bonus, Tile } from './tiles.model';

@Component({
	selector: 'app-tiles',
	templateUrl: './tiles.component.html',
	styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent {
	private monsterCount = 15;
	private teleporterCount = 8;
	private tileCount = 44; //multipe of 11
	private tilesPerPage = 11;
	private tiles: Tile[] = [];

	tilesArray: Tile[][] = [];

	constructor() {
		this.generateTileJson();
		for (let i = 0; i < this.tiles.length / this.tilesPerPage; i++) {
			this.tilesArray[i] = this.tiles.slice(
				i * this.tilesPerPage,
				i * this.tilesPerPage + this.tilesPerPage
			);
		}
	}

	generateTileJson() {
		this.genereateTiles(false, true, this.monsterCount);
		this.genereateTiles(true, false, this.teleporterCount);
		this.genereateTiles(
			false,
			false,
			this.tileCount - this.teleporterCount - this.monsterCount
		);
	}

	genereateTiles(isTeleporters: boolean, isMonsters: boolean, count: number) {
		for (let i = 0; i < count; i++) {
			this.tiles.push(new Tile(isTeleporters, isMonsters));
		}
	}
}
