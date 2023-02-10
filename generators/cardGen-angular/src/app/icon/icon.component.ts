import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../services/csv.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
//#FB3640 - Red
//#9BC53D - Green
//#00A1E4 - Blue
//#E1BC29 - Gold

export class IconComponent implements OnInit {
  @Input() icon?: Icon;
  @Input() fontSize: number = 64;
  public iconChar: string = '';
  public color: string = '#000';
  public displayValue: boolean = false;
  constructor() { }

  ngOnInit(): void {
    switch(this.icon?.type) {
      case('gem'): {
        this.iconChar = 'G';
        this.setGemColor(this.icon.value as string);
        break;
      }
      case('gold'): {
        this.iconChar = 'B';
        this.color = '#E1BC29';
        this.displayValue = true;
        break;
      }
      case('slot'): {
        this.iconChar = 'S';
        this.displayValue = true;
        break;
      }
      case('dice'): {
        this.setDiceSymbol(this.icon.value as string);
        break;
      }
    }
  }
  setDiceSymbol(face: string | number) {
    switch(face) {
      case('Crit'): {
        this.iconChar = 'C';
        this.color = '#000';
        break;
      }
      case('Hit'): {
        this.iconChar = '~';
        this.color = '#000';
        break;
      }
      case('!'): {
        this.iconChar = '!';
        this.color = '#E1BC29';
        break;
      }
      case(0): {
        this.iconChar = 'M';
        this.color = '#FB3640';
        break;
      }
    }
  }
  setGemColor(value: string): void {
    switch(value) {
      case('R'): {
        this.color = '#FB3640';
        break;
      }
      case('G'): {
        this.color = '#9BC53D';
        break;
      }
      case('B'): {
        this.color = '#00A1E4';
        break;
      }
    }
  }

}
