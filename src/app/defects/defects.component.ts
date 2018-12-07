import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

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
	
	galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
	
	constructor(
	private route: ActivatedRoute,
	private location: Location,
	private placeService: PlaceService
	) { }

	ngOnInit() {
		this.getPlace();
		
		this.galleryOptions = [
            {
                width: '600px',
                height: '400px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 800
            {
                breakpoint: 800,
                width: '100%',
                height: '600px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
            },
            // max-width 400
            {
                breakpoint: 400,
                preview: false
            }
        ];
	}
  
	onSelect(defect: Defect): void {
		this.selectedDefect = defect;
		this.galleryImages = defect.pictures;
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
