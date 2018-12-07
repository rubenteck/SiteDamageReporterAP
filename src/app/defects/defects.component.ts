import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

import { Defect } from '../defect';
import { Place } from '../place';

import { PlaceService } from '../place.service';

@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.css']
})
export class DefectsComponent implements OnInit {
	
	places: Place[];
	place: Place;
	selectedDefect: Defect;
	defects: Defect[];
	
	constructor(
	private route: ActivatedRoute,
	private location: Location,
	private placeService: PlaceService
	) { }

	ngOnInit() {
		this.getPlace();
	}
  
	onSelect(defect: Defect): void {
		this.selectedDefect = defect;
	}
	
	getPlace(): void {
		const name = this.route.snapshot.paramMap.get('name');
		//console.log(name.toString());
		
		this.placeService.getPlaces().subscribe(places => {
			this.places = places;
			//console.log(this.places);
			
			for (var i = 0, len = this.places.length; i < len; i++){
				//console.log(this.places[i] + ": " + this.places[i].name);
				if(this.places[i].name == name.toString()){
					this.place = this.places[i];
					this.getDefects();
					return;
				}
			}
		});
	}
	
	getDefects(): void {
		this.defects = this.place.defects;
	}

	goBack(): void {
		this.location.back();
	}
	
	save(): void {
		for (var i = 0, len = this.place.defects.length; i < len; i++){
			if(this.place.defects[i].name == this.selectedDefect.name){
				this.place.defects[i] = this.selectedDefect;
			}
		}
		
		this.placeService.updatePlace(this.place);
	}

}
