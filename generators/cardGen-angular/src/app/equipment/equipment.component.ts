import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CsvService, Equipment } from '../services/csv.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  public loadedEquipment$: Observable<Equipment[]> | undefined;
  public sheetStyle = {
    display: 'grid', 
    'grid-template-columns': '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', 
    'grid-template-rows': '1fr 1fr 1fr 1fr 1fr 1fr 1fr', 
    gap: '0px 0px', 
  }
  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.loadedEquipment$ = this.csvService.equipment$;
  }

}
