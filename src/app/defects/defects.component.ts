import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
		const name = +this.route.snapshot.paramMap.get('name');
		this.places = this.placeService.getPlaces().subscribe(places => this.places = places);
		this.places.forEach(function(item, index, arr){if(item.name == name.toString()){this.place = item}});
	}
	
	getDefects(): void {
		this.defects = this.place.defects;
	}

	goBack(): void {
		this.location.back();
	}

}
