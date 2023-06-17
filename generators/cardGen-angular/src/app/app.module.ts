import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardMainComponent } from './card-main/card-main.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { CsvService } from './services/csv.service';
import { UsablesComponent } from './usables/usables.component';
import { IconComponent } from './icon/icon.component';
import { RulesTextComponent } from './rules-text/rules-text.component';
import { TilesComponent } from './tiles/tiles.component';
import { HexComponent } from './tiles/tile-page/tile/hex/hex.component';
import { TileComponent } from './tiles/tile-page/tile/tile.component';
import { TilePageComponent } from './tiles/tile-page/tile-page.component';

@NgModule({
	declarations: [
		AppComponent,
		CardMainComponent,
		EquipmentComponent,
		UsablesComponent,
		IconComponent,
		RulesTextComponent,
		TilesComponent,
		HexComponent,
		TileComponent,
		TilePageComponent,
	],
	imports: [BrowserModule, AppRoutingModule],
	providers: [CsvService],
	bootstrap: [AppComponent],
})
export class AppModule {}
