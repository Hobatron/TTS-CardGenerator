import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { defer, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Mapper } from '../mappers/mapper';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  equipment$: Observable<Equipment[]> | undefined;
  mapper: Mapper = new Mapper();
  constructor() { 
    this.equipment$ = defer(() => from(this.getEquipmentCSV()))
  }

  getEquipmentCSV() {
    const octokit = new Octokit({
      auth: environment.github
    })

    return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'Hobatron',
      repo: 'TTS-CardGenerator',
      path: 'generators/cardGen-angular/equipmentCsv.csv',
      mediaType: {
        format: 'raw'
      }
    }).then((value) => {
      return this.castToEquipment(value.data as any);
    })
  }

  private castToEquipment(glob: string): any {
    let equipment: Equipment[] = []
    if(glob) {
      const rows = glob.split('\n');
      if (rows[0] === 'Text,Cost') {
        delete rows[0];
        rows.forEach(row => {
          const cols = row.match(/(\\.|[^,])+/g);
          if (cols?.length && cols?.length <= 2) {
            //Might be better to add cols to the csv rather than using regex here
            let type = cols[0].match(/(?<=\[)(.*?)(?=\])/g) as any; // returns anything in [] i.e. [Attack/Mine]
            let name = cols[0].match(/(?<=\|)(.*?)(?=\|)/g) as any; // returns anything in || i.e. |My Magic Item|
            let noTypes = cols[0].split(']')[cols[0].split(']').length - 1]; // returns everything after any []
            let rules = noTypes?.split('|')[noTypes.split('|').length - 1]; // returns everything after any []
            let cost = this.mapper.cost(cols[1]);

            equipment.push({
              cost: cost,
              name: name ? name[0] : undefined,
              rules: rules,
              type: type ? type[0] : undefined
            }) 
          } else if(cols != null) {
            console.error('Invalid columns, check for unescaped commas: ', cols);
            throw new Error('');
          }
        })
      } else {
        console.error('Impropper equipment headers in equipmentCsv.csv: ', rows[0]);
      }
    } else {
      throw new Error('The file existed, but it seems empty');
    }

    return equipment;
  }
}

export interface Icon {
  type: 'gem' | 'gold' | 'slot' | 'dice'
  value: number | string
}

export interface Equipment {
  cost: Icon[] | undefined;
  name: string | undefined;
  type: string | undefined;
  rules: string | undefined;
}



