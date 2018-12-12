import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import 'hammerjs';
import { ToastrService } from 'ngx-toastr';

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
	private placeService: PlaceService,
	private toastr: ToastrService
	) {	}

	ngOnInit() {
		this.getPlace();
		
		this.galleryOptions = [
			{ 
				"previewFullscreen": true, 
				"imageAnimation": "slide", 
				"previewAnimation": false, 
				"previewInfinityMove": true, 
				"imageInfinityMove": true, 
				"previewKeyboardNavigation": true, 
				"thumbnailsMoveSize": 4, 
				"previewCloseOnClick": true, 
				"previewCloseOnEsc": true, 
				"previewZoom": true, 
				"previewZoomStep": 1, 
				"previewZoomMax": 5, 
				"previewZoomMin": 1, 
				"previewRotate": true, 
				"imageSwipe": true, 
				"thumbnailsSwipe": true, 
				"previewSwipe": true, 
				"imageArrowsAutoHide": true, 
				"thumbnailsArrowsAutoHide": true 
				//"arrowPrevIcon": "", 
				//"arrowNextIcon": ""
			},
			{ "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
			{ "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
        ];
	}
  
	onSelect(defect: Defect): void {
		this.selectedDefect = defect;
		
		//fill galleryImages
		var obj = '[';
		for (var i = 0, len = defect.pictures.length; i < len; i++){
			obj += '{ "small": "' + defect.pictures[i] + '", "medium": "' + defect.pictures[i] + '", "big": "' + defect.pictures[i] + '"}';
			if (i < len - 1){
				obj += ', ';
			}
		}
		obj += ']';
		//console.log(JSON.parse(obj));
		this.galleryImages = JSON.parse(obj);
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
		//input checks
		if(this.selectedDefect.status!=1){
			if(this.selectedDefect.repair_date==null || this.selectedDefect.responsible_person=="" || this.selectedDefect.responsible_instance==""){
				this.toastr.error("kijk na of de velden 'reparatie datum', 'bevoegd persoon' en 'bevoegde instelling' ingevuld zijn");
				return;
			}
		}
		
		//update data
		this.selectedDefect.last_edited = new Date();
		for (var i = 0, len = this.place.defects.length; i < len; i++){
			if(this.place.defects[i].name == this.selectedDefect.name){
				this.place.defects[i] = this.selectedDefect;
			}
		}
		
		this.placeService.updatePlace(this.place);
		this.toastr.success("saved!");
	}

}
