import { Component, Input, OnInit } from '@angular/core';
import { CardConstants } from '../mainVariables';
import { Icon } from '../services/csv.service';

@Component({
	selector: 'app-card-main',
	templateUrl: './card-main.component.html',
	styleUrls: ['./card-main.component.scss'],
})
export class CardMainComponent implements OnInit {
	public cardConsts = new CardConstants();
	public fontSize = 100;
	public cardStyle = {
		width: this.cardConsts.width + 'px',
		height: this.cardConsts.height + 'px',
		'background-color': '#000',
		display: 'grid',
		margin: this.cardConsts.cardSpacing + 'px',
	};
	@Input() public type?: string;
	@Input() public costs?: Icon[];
	@Input() public name?: string;
	@Input() public rules?: string;
	@Input() public isAction?: boolean = false;

	constructor() {}

	ngOnInit(): void {
		const charCount = this.rules?.length || 0;
		switch (true && !this.isAction) {
			case charCount >= 0 && charCount <= 50:
				this.fontSize = 52;
				break;
			case charCount >= 51 && charCount <= 100:
				this.fontSize = 48;
				break;
			case charCount >= 101 && charCount <= 150:
				this.fontSize = 42;
				break;
			// Add more cases for other ranges as needed
			default:
				this.fontSize = 32;
				break;
		}
	}
}
