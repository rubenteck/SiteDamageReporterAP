import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { Place } from './place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
	
	itemDoc: AngularFirestoreDocument<Place>;
		
	private placeCollection: AngularFirestoreCollection<Place>;
	places: Observable<Place[]>;
	
	constructor(private db: AngularFirestore, private toastr: ToastrService, private afAuth: AngularFireAuth) { }
	
	getPlaces(): Observable<Place[]> {
		//login check checks to fast on startup (only a problem for testing and if user can be automatically logged in) and gives error with observable
		/*if(this.afAuth.auth.currentUser==null){
			this.toastr.error("please make sure you are logged in");
		}
		else{*/
		
			//get places
			this.placeCollection = this.db.collection<Place>('places');
			this.places = this.placeCollection.snapshotChanges().map(actions => {
				return actions.map(a => {
					const data = a.payload.doc.data() as Place;
					const id = a.payload.doc.id;
					return { id, ...data };
				});
			});
			return this.places;
			
		//}
	}
	
	updatePlace(place: Place){
		//check logged in
		if(this.afAuth.auth.currentUser==null){
			this.toastr.error("please make sure you are logged in");
			return;
		}
		
		//update place
		this.itemDoc = this.db.doc<Place>('places/' + place.id);
		this.itemDoc.update(place).then(
			succes => {
				this.toastr.success("saved!");
			},
			error => {
				this.toastr.error("something went wrong!");
			}
		);
	}
  
}
