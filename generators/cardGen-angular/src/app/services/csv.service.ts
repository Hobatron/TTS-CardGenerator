import { Injectable } from '@angular/core';
import { Octokit } from 'octokit';
import { defer, from, Observable } from 'rxjs';

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
      auth: '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'
    })

    return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'Hobatron',
      repo: 'TTS-CardGenerator',
      path: 'generators/CardGen/equipmentCsv.csv',
      mediaType: {
        format: 'raw'
      }
    }).then((value) => {
      return this.castToEquipment(atob((value.data as any).content));
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
          if (cols?.length === 2) {
            equipment.push({
              rawText: cols[0],
              rawCost: cols[1]
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
  rawText: string,
  rawCost: string
}



