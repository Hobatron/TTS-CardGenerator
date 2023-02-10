import { Component, Input, OnInit } from '@angular/core';
import { Mapper } from '../mappers/mapper';
import { Icon } from '../services/csv.service';

@Component({
  selector: 'app-rules-text',
  templateUrl: './rules-text.component.html',
  styleUrls: ['./rules-text.component.scss']
})
export class RulesTextComponent implements OnInit {
  @Input() rules?: string;

  public splitRules: string[] = [];
  public mapper = new Mapper();
  public resourceCosts: Array<Icon[] | undefined> = [];

  constructor() { 
  }

  ngOnInit(): void {
    if (!this.rules) {
      this.rules = ''
    }
    this.splitRules = this.rules.split(/(\{.*?\})/g);
    this.splitRules.forEach((partialRule, i) => {
      if (partialRule.charAt(0) == '{') {
        this.resourceCosts.push(this.mapper.cost(this.splitRules.splice(i, 1)[0]));
      }
    });
  }

}
