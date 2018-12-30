import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { Place } from '../place';

import { PlaceService } from '../place.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
	
	placesSub;
	places: Place[];
	
	constructor(private placeService: PlaceService) { }

	ngOnInit() {
		//setTimeout(() => {}, 5000);
		this.getPlaces();
	}
	
	getPlaces(): void {
		this.placesSub = this.placeService.getPlaces().subscribe(places => this.places = places);
	}
	
	ngOnDestroy() {
		
	}
	
}
