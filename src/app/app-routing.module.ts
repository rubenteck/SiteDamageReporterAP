import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication/authentication.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { PlacesComponent } from './places/places.component';
import { DefectsComponent } from './defects/defects.component';

const routes: Routes = [
	{ path: '', redirectTo: '/places', pathMatch: 'full' },
	{ path: 'userInfo', component: UserInfoComponent },
	{ path: 'authentication', component: AuthenticationComponent },
	{ path: 'places', component: PlacesComponent },
	{ path: 'defects/:name', component: DefectsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
