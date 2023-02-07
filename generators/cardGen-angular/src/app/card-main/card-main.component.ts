import { Component, Input, OnInit } from '@angular/core';
import { CardConstants } from '../mainVariables';

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
    padding: 35 + 'px',
    border: 35 + 'px ' + 'solid' + '#000'
    
  };
  @Input() public type?: string;
  @Input() public cost?: string;
  @Input() public name?: string;
  @Input() public rules?: string;

  constructor() {
    console.log(this.cardStyle);
    
   }

  ngOnInit(): void {

  }

}
