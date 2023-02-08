import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { defer, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  equipment$: Observable<Equipment[]> | undefined;
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
      path: 'generators/old-CardGen/equipmentCsv.csv',
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
            let cost = this.mapCost(cols[1]);

            equipment.push({
              cost: cost,
              name: name ? name[0] : undefined,
              rules: rules,
              type: type ? type[0] : undefined
            }) 
          } else {
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
  
  mapCost(col: string): Resource[] | undefined {
    let cost: Resource[] = [] as Resource[];
    if (!col) {
      return undefined;
    }
    col = col.replace(/[{}]/g, '');
    let keyValues: Array<string[]> = [];
    col.split(';').forEach(keyValue => keyValues.push(keyValue.split(':')));
    keyValues.forEach(kv => {
      cost.push({
        type: kv[0].toLowerCase() as 'gem' | 'gold' | 'slot',
        value: parseInt(kv[1])
      });
    });

    return cost;
  }
}

export interface Resource {
  type: 'gem' | 'gold' | 'slot'
  value: number
}

export interface Equipment {
  cost: Resource[] | undefined;
  name: string | undefined;
  type: string | undefined;
  rules: string | undefined;
}



