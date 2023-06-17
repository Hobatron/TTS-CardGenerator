import { Component, Input, OnInit } from '@angular/core';
import { Hex, Terrain } from 'src/app/tiles/models';

@Component({
	selector: 'app-hex',
	templateUrl: './hex.component.html',
	styleUrls: ['./hex.component.scss'],
})
export class HexComponent implements OnInit {
	@Input() hex!: Hex;

	get bgUrl() {
		let terrain = '';
		switch (this.hex?.terrain) {
			case Terrain.lava: {
				terrain = 'lava';
				break;
			}
			case Terrain.water: {
				terrain = 'water';
				break;
			}
			case Terrain.roughTerrain: {
				terrain = 'roughTerrain';
				break;
			}
			default: {
				terrain = 'grass';
				break;
			}
		}
		return terrain;
	}
	constructor() {}

	ngOnInit(): void {
		console.log(this.hex);
	}
}
