import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../services/csv.service';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
  @Input() resource?: Resource;
  public icon: string = '';

  constructor() { }

  ngOnInit(): void {
    switch(this.resource?.type) {
      case('gem'): {
        this.icon = 'B';
        break;
      }
      case('gold'): {
        this.icon = 'C';
        break;
      }
      case('slot'): {
        this.icon = 'S';
        break;
      }
    }
  }

}
