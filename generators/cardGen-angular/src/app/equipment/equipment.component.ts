import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CsvService, Equipment } from '../services/csv.service';
import { CardConstants } from '../mainVariables';
import html2canvas from 'html2canvas';

@Component({
	selector: 'app-equipment',
	templateUrl: './equipment.component.html',
	styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {
	public loadedEquipment$: Observable<Equipment[][]> | undefined;
	public cardConst: CardConstants = new CardConstants();
	public sheetStyle = {
		width:
			this.cardConst.cols * this.cardConst.width +
			this.cardConst.cardSpacing * this.cardConst.cols * 2 +
			'px',
		display: 'grid',
		'grid-template-columns': `${'1fr '.repeat(this.cardConst.cols)}`,
		gap: '0px 0px',
	};
	constructor(private csvService: CsvService) {}

	ngOnInit(): void {
		this.loadedEquipment$ = this.csvService.equipments$;
		this.csvService.equipments$?.subscribe((v) => {
			if (v) {
				//setTimeout(this.appendImage, 200)
			}
		});
	}

	appendImage() {
		html2canvas(
			document.getElementById('image-section') ?? new HTMLElement()
		).then(function (canvas) {
			document.body.appendChild(canvas);
		});
	}

	generateImage() {}
}
