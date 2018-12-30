import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication/authentication.component';
import { PlacesComponent } from './places/places.component';
import { DefectsComponent } from './defects/defects.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
	{ path: '', redirectTo: '/places', pathMatch: 'full' },
	{ path: 'users', component: UsersComponent },
	{ path: 'authentication', component: AuthenticationComponent },
	{ path: 'places', component: PlacesComponent },
	{ path: 'defects/:name', component: DefectsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
