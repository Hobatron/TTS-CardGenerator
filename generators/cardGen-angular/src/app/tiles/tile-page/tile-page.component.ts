import { Component, Input, OnInit } from '@angular/core';
import { Tile } from '../models';

@Component({
	selector: 'app-tile-page',
	templateUrl: './tile-page.component.html',
	styleUrls: ['./tile-page.component.scss'],
})
export class TilePageComponent implements OnInit {
	@Input() tiles!: Tile[];
	constructor() {}

	ngOnInit(): void {}
}
