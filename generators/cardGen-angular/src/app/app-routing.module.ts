import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipmentComponent } from './equipment/equipment.component';
import { UsablesComponent } from './usables/usables.component';
import { TilesComponent } from './tiles/tiles.component';
import { ActionsComponent } from './actions/actions.component';

const routes: Routes = [
	{ path: 'equipment', component: EquipmentComponent },
	{ path: 'usables', component: UsablesComponent },
	{ path: 'actions', component: ActionsComponent },
	{ path: 'tiles', component: TilesComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
