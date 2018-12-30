import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import 'rxjs/add/observable/empty';
import { Router } from '@angular/router';

import { Place } from './place';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
	
	itemDoc: AngularFirestoreDocument<Place>;
		
	private placeCollection: AngularFirestoreCollection<Place>;
	places: Observable<Place[]>;
	
	index: number = 0;
	
	constructor(private db: AngularFirestore, private toastr: ToastrService, private afAuth: AngularFireAuth, private userService: UserService, private router: Router) { }
	
	getPlaces(): Observable<Place[]> {
		//check if logged in
		if(this.afAuth.auth.currentUser==null && this.index < 3){
			this.index++;
			setTimeout(() => {
				return this.getPlaces();
			}, 1000);
		}
		else if(this.afAuth.auth.currentUser==null){
			this.router.navigate(['/authentication']);
			this.toastr.error("controleer of u bent ingelogd");
		}
		
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
	}
	
	updatePlace(place: Place){
		//check logged in
		if(this.afAuth.auth.currentUser==null){
			this.toastr.error("controleer of u bent ingelogd");
			return;
		}
		
		//update place
		this.itemDoc = this.db.doc<Place>('places/' + place.id);
		this.itemDoc.update(place).then(
			succes => {
				this.toastr.success("het defect is aangepast!");
			},
			error => {
				this.toastr.error("er ging iets mis!");
			}
		);
	}
  
}
