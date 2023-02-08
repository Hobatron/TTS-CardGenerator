import { Component, Input, OnInit } from '@angular/core';
import { CardConstants } from '../mainVariables';
import { Resource } from '../services/csv.service';

@Component({
  selector: 'app-card-main',
  templateUrl: './card-main.component.html',
  styleUrls: ['./card-main.component.scss']
})
export class CardMainComponent implements OnInit {
  public cardConsts = new CardConstants();
  public cardStyle = {
    width: this.cardConsts.width+'px', 
    height: this.cardConsts.height+'px',
    'background-color': '#000',
    display: 'grid',
  };
  @Input() public type?: string;
  @Input() public costs?: Resource[];
  @Input() public name?: string;
  @Input() public rules?: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
