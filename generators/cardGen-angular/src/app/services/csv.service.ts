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
            //Might be better to add cols to the csv vs using regex here
            let type = cols[0].match(/(?<=\[)(.*?)(?=\])/g) as any; // returns anything in [] i.e. [Attack/Mine]
            let name = cols[0].match(/(?<=\|)(.*?)(?=\|)/g) as any; // returns anything in || i.e. |My Magic Item|
            let noTypes = cols[0].split(']')[cols[0].split(']').length - 1];
            let rules = noTypes?.split('|')[noTypes.split('|').length - 1]
            console.log(name);
            
            equipment.push({
              cost: cols[1],
              name: name ? name[0] : null,
              rules: rules,
              type: type ? name[0] : null
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
}

export interface Equipment {
  cost: string | null;
  name: string | null;
  type: string | null;
  rules: string | null;
}



