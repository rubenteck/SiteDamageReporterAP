import { Component, OnInit } from '@angular/core';

import { Place } from '../place';

import { PlaceService } from '../place.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
	
	places: Place[];
	
	constructor(private placeService: PlaceService) { }

	ngOnInit() {
		this.getPlaces();
	}
	
	getPlaces(): void {
		this.placeService.getPlaces().subscribe(places => this.places = places);
	}


}
