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

  constructor(private csvService: CsvService) { }

  ngOnInit(): void {
    this.loadedEquipment$ = this.csvService.equipment$;
  }

}
