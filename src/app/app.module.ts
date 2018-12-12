import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { NgxGalleryModule } from 'ngx-gallery';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlacesComponent } from './places/places.component';
import { DefectsComponent } from './defects/defects.component';

@NgModule({
  declarations: [
    AppComponent,
    PlacesComponent,
    DefectsComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
    AppRoutingModule,
	NgxGalleryModule,
	ToastrModule.forRoot({newestOnTop: false,}), // ToastrModule added
	AngularFireModule.initializeApp(environment.firebase),
	AngularFirestoreModule // imports firebase/firestore, only needed for database features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
