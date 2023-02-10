import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../services/csv.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
//#9BC53D - Red
//#9BC53D - Green
//#00A1E4 - Blue
//#E1BC29 - Gold

export class IconComponent implements OnInit {
  @Input() resource?: Resource;
  @Input() fontSize: number = 64;
  public icon: string = '';
  public color: string = '#000';
  public displayValue: boolean = false;
  constructor() { }

  ngOnInit(): void {
    switch(this.resource?.type) {
      case('gem'): {
        this.icon = 'C';
        this.setGemColor(this.resource.value as string);
        break;
      }
      case('gold'): {
        this.icon = 'B';
        this.color = '#E1BC29';
        this.displayValue = true;
        break;
      }
      case('slot'): {
        this.icon = 'S';
        this.displayValue = true;
        break;
      }
    }
  }
  setGemColor(value: string): void {
    switch(value) {
      case('R'): {
        this.color = '#9BC53D';
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
