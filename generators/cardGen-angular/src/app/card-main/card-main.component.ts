import { Component, OnInit } from '@angular/core';
import { CardConstants } from '../mainVariables';

@Component({
  selector: 'app-card-main',
  templateUrl: './card-main.component.html',
  styleUrls: ['./card-main.component.scss']
})
export class CardMainComponent implements OnInit {
  public cardConsts = new CardConstants();

  constructor() { }

  ngOnInit(): void {
    console.log(this.cardConsts.cols);
    
  }

}
