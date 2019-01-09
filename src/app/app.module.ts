import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NgxGalleryModule } from 'ngx-gallery';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlacesComponent } from './places/places.component';
import { DefectsComponent } from './defects/defects.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { UsersComponent } from './users/users.component';
import { AllDefectsComponent } from './all-defects/all-defects.component';

@NgModule({
  declarations: [
	AuthenticationComponent,
    AppComponent,
    PlacesComponent,
    DefectsComponent,
    UsersComponent,
    AllDefectsComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
    AppRoutingModule,
	NgxGalleryModule,
	BrowserAnimationsModule,
	ToastrModule.forRoot({newestOnTop: false,}), // ToastrModule added
	AngularFireModule.initializeApp(environment.firebase),
	AngularFirestoreModule // imports firebase/firestore, only needed for database features
  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
