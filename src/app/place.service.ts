import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { Place } from './place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
	
	db: AngularFirestore;
	itemDoc: AngularFirestoreDocument<Place>;
	
	private placeCollection: AngularFirestoreCollection<Place>;
	places: Observable<Place[]>;
	
	constructor(db: AngularFirestore) {
		this.db = db;
	}
	
	getPlaces(): Observable<Place[]> {
		this.placeCollection = this.db.collection<Place>('places');
		// .snapshotChanges() returns a DocumentChangeAction[], which contains
		// a lot of information about "what happened" with each change. If you want to
		// get the data and the id use the map operator.
		this.places = this.placeCollection.snapshotChanges().map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Place;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
		});
		
		return this.places;
	}
	
	updatePlace(place: Place){
		this.itemDoc = this.db.doc<Place>('places/' + place.id);
		this.itemDoc.update(place);
	}
  
}
