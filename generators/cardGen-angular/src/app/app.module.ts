import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardMainComponent } from './card-main/card-main.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { CsvService } from './services/csv.service';
import { UsablesComponent } from './usables/usables.component';

@NgModule({
  declarations: [
    AppComponent,
    CardMainComponent,
    EquipmentComponent,
    UsablesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CsvService],
  bootstrap: [AppComponent]
})
export class AppModule { }
