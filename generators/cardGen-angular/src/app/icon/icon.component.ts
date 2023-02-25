import { Component, Input, OnInit } from '@angular/core';
import { Icon } from '../services/csv.service';

interface CharColor {
  char?: string,
  color?: string
}

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
  public iconChars: CharColor[] = [];
  public displayValue = '';
  constructor() { }

  ngOnInit(): void {
    switch(this.icon?.type.trim()) {
      case('gem'): {
        this.setGems(this.icon.value as string);
        break;
      }
      case('gold'): {
        this.iconChars.push({
          char: 'B',
          color: '#E1BC29'
        }) 
        this.displayValue = 'x';
        break;
      }
      case('slot'): {
        console.log(this.icon?.value);
        
        this.displayValue = '+';
        break;
      }
      case('dice'): {
        this.setDiceSymbol(this.icon.value as string);
        break;
      }
    }
  }

  private setDiceSymbol(faces: string) {
    faces.split('-').forEach((face) => {
      switch(faces) {
        case('Crit'): {
          this.iconChars.push({
            char:  'C',
            color: '#000',
          })
          break;
        }
        case('Hit'): {
          this.iconChars.push({
            char:  '~',
            color: '#000',
          })
          break;
        }
        case('!'): {
          this.iconChars.push({
            char:  '!',
            color: '#E1BC29',
          })
          break;
        }
        case('Miss'): {
          this.iconChars.push({
            char:  'M',
            color: '#FB3640',
          })
          break;
        }
      }
    })

  }

  private setGems(value: string): void {
    //Format for value: G,G-R-B
    value.split('-').forEach((gem) => {
      let color = '';
      switch(gem) {
        case('R'): {
          color = '#FB3640';
          break;
        }
        case('G'): {
          color = '#9BC53D';
          break;
        }
        case('B'): {
          color = '#00A1E4';
          break;
        }
      }

      this.iconChars.push({
        char: 'G',
        color
      })
    })
    
  }

}
