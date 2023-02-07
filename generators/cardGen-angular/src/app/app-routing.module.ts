import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { UsablesComponent } from './usables/usables.component';

const routes: Routes = [
   { path: 'equipment', component: EquipmentComponent },
   { path: 'usables', component: UsablesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
