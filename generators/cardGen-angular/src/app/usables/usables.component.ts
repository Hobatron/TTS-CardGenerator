import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CsvService, Usable } from '../services/csv.service';
import { CardConstants } from '../mainVariables';
import * as htmlToImage from 'html-to-image';

@Component({
	selector: 'app-usables',
	templateUrl: './usables.component.html',
	styleUrls: ['./usables.component.scss'],
})
export class UsablesComponent implements OnInit {
	public loadedUsables$: Observable<Usable[][]> | undefined;
	public cardConst: CardConstants = new CardConstants();
	public sheetStyle = {
		//this margin is oddly needed, to offset the image generated via the htmlToImage package
		margin: ((1 - 0.92) / 2) * this.cardConst.width + 'px', //92%: this number must match throughout search the project for this comment for refrences
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
		this.loadedUsables$ = this.csvService.usables$;
	}

	appendImage() {
		var node: HTMLElement =
			document.getElementById('image-section') ?? new HTMLElement();
		htmlToImage
			.toPng(node, {
				backgroundColor: '#000',
			})
			.then((dataUrl) => {
				var img = new Image();
				img.src = dataUrl;
				document.body.appendChild(img);
				node.remove(); // makes it easy to test
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
	}

	generateImage() {
		var node: any = document.getElementById('image-section');
		htmlToImage
			.toPng(node, {
				backgroundColor: '#000',
			})
			.then((dataUrl) => {
				var download = document.createElement('a');
				download.href = dataUrl;
				download.download = 'usableCards.png';
				download.click();
			})
			.catch((error) => {
				console.error('oops, something went wrong!', error);
			});
	}
}
