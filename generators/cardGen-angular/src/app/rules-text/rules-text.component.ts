import { Component, Input, OnInit } from '@angular/core';
import { Mapper } from '../mappers/mapper';
import { Icon } from '../services/csv.service';

@Component({
	selector: 'app-rules-text',
	templateUrl: './rules-text.component.html',
	styleUrls: ['./rules-text.component.scss'],
})
export class RulesTextComponent implements OnInit {
	@Input() rules?: string;
	@Input() fontSize!: number;

	public splitRules: string[] = [];
	public mapper = new Mapper();
	public resourceCosts: Array<Icon[] | undefined> = [];
	rulesIconToTextRatio = 42 / 32; //magic number from what looks decent

	constructor() {}

	ngOnInit(): void {
		let logging = this.rules?.includes('Target');

		if (!this.rules) {
			this.rules = '';
		}
		this.splitRules = this.rules.split(/(\{.*?\})/g);
		this.splitRules.forEach((partialRule, i) => {
			if (partialRule.charAt(0) == '{') {
				this.resourceCosts.push(
					this.mapper.cost(this.splitRules.splice(i, 1)[0])
				);
			}
		});
		this.splitRules.forEach((r, i) => {
			this.splitRules[i] = r.replace(/:N/, '<br>');
		});
		if (logging) {
			console.log(this.splitRules);
		}
	}
}
