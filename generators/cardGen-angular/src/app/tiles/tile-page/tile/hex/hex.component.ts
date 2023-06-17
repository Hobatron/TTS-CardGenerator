import { Component, Input, OnInit } from '@angular/core';
import { Bonus, Hex, Terrain } from 'src/app/tiles/tiles.model';

@Component({
	selector: 'app-hex',
	templateUrl: './hex.component.html',
	styleUrls: ['./hex.component.scss'],
})
export class HexComponent implements OnInit {
	@Input() hex!: Hex;
	public Bonus = Bonus;
	get bgUrl() {
		let terrain = '';
		switch (this.hex?.terrain) {
			case Terrain.Lava: {
				terrain = 'lava';
				break;
			}
			case Terrain.Water: {
				terrain = 'water';
				break;
			}
			case Terrain.RoughTerrain: {
				terrain = 'roughTerrain';
				break;
			}
			default: {
				if (this.hex.bonus == Bonus.Teleport) {
					terrain = 'teleporter';
				} else {
					terrain = 'grass';
				}
				break;
			}
		}
		return terrain;
	}

	constructor() {}

	ngOnInit(): void {}
}
