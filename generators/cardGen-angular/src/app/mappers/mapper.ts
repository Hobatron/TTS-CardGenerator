import { Icon } from "../services/csv.service";

export class Mapper {
    cost(col: string): Icon[] {
        let cost: Icon[] = [] as Icon[];
        if (!col) {
          return [];
        }
        col = col.replace(/[{}]/g, '');
        let keyValues: Array<string[]> = [];
        col.split(';').forEach(keyValue => keyValues.push(keyValue.split(':')));
        keyValues.reverse().forEach(kv => { //.reverse() since they float right, this keeps them in order typed
          cost.push({
            type: kv[0].toLowerCase() as 'gem' | 'gold' | 'slot',
            value: isNaN(parseInt(kv[1])) ? kv[1] : parseInt(kv[1])
          });
        });
    
        return cost;
      }
}

