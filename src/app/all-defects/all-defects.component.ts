import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import 'hammerjs';
import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Router } from '@angular/router';

import { Defect } from '../defect';
import { Place } from '../place';
import { User } from '../user';

import { PlaceService } from '../place.service';
import { UserService } from '../user.service';

@AutoUnsubscribe({event: 'onSelect'})
@AutoUnsubscribe({event: 'ngOnDestroy'})
@AutoUnsubscribe({event: 'save'})
@Component({
  selector: 'app-all-defects',
  templateUrl: './all-defects.component.html',
  styleUrls: ['./all-defects.component.css']
})
export class AllDefectsComponent implements OnInit {
	
	selectedDefect: Defect;
	defects: Defect[];
	place: Place;
	places: Place[];
	lastEditor: User;
	userSub;
	placesSub;
	currentUserSub1;
	currentUserSub2;
	
	galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

	constructor(
	private route: ActivatedRoute,
	private location: Location,
	private placeService: PlaceService,
	private userService: UserService,
	private toastr: ToastrService,
	private router: Router
	) { }

	ngOnInit() {
		//check if logged in
		this.currentUserSub1 = this.userService.getCurrentUser().subscribe(user => {
			if(user == null){
				this.router.navigate(['/authentication']);
				this.toastr.error("u bent niet ingelogd");
			}
			else{
				this.getDefects();
			}
		});
		
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
			},
			{ "breakpoint": 500, "width": "300px", "height": "300px", "thumbnailsColumns": 3 },
			{ "breakpoint": 300, "width": "100%", "height": "200px", "thumbnailsColumns": 2 }
        ];
	}
	
	onSelect(defect: Defect): void {		
		//get last editor name
		try{
			this.userSub = this.userService.getUser(defect.last_editor).subscribe(user => this.lastEditor = user);
		}catch(err){
			//console.log(err);
			this.lastEditor = null;
		}
		
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
	
	getDefects(){
		this.placesSub = this.placeService.getPlaces().subscribe(places => {
			
			this.places = places;
			
			//empty defects list
			this.defects = [];
			
			for (var x = 0, len = places.length; x < len; x++){
				
				if(places[x].defects != null){
					//change all timestamps to dates
					for (var i = 0, len = places[x].defects.length; i < len; i++){
					
						if(Object.prototype.toString.call(places[x].defects[i].last_edited) !== "[object Date]"){
							
							places[x].defects[i].last_edited = new Date((places[x].defects[i].last_edited as any).seconds * 1000);	//as any cast needed to stop error, console thinks it is a Date
							
						}
					}
				}
			
			this.defects = this.defects.concat(places[x].defects);
			
			}
			
			//remove first defect (empty)
			this.defects = this.defects.slice(1);
			
		}, err => {
			this.router.navigate(['/places']);
			this.toastr.error("er ging iets mis");
		});
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
		this.currentUserSub2 = this.userService.getCurrentUser().subscribe(user => {
			if(user==null){
				return;
			}
			//console.log(user);
			this.selectedDefect.last_editor = user.uid;
			this.selectedDefect.last_edited = new Date();
			for (var x = 0, len = this.places.length; x < len; x++){
				if(this.places[x].defects != null){
					for (var i = 0, len = this.places[x].defects.length; i < len; i++){
						if(this.places[x].defects[i].name == this.selectedDefect.name){
							this.places[x].defects[i] = this.selectedDefect;
							this.place = this.places[x];
						}
					}
				}
			}
		
			this.placeService.updatePlace(this.place);
		});
	}
	
	ngOnDestroy(){
		
	}

}
  