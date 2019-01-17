import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import 'hammerjs';
import { ToastrService } from 'ngx-toastr';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Defect } from '../defect';
import { Place } from '../place';
import { User } from '../user';

import { PlaceService } from '../place.service';
import { UserService } from '../user.service';

@AutoUnsubscribe({event: 'onSelect'})
@AutoUnsubscribe({event: 'ngOnDestroy'})
@AutoUnsubscribe({event: 'save'})
@Component({
  selector: 'app-defects',
  templateUrl: './defects.component.html',
  styleUrls: ['./defects.component.css']
})
export class DefectsComponent implements OnInit {
	
	place: Place;
	selectedDefect: Defect;
	defects: Defect[];
	lastEditor: User;
	userSub;
	placeSub;
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
	private router: Router,
	public datepipe: DatePipe
	) {	}

	ngOnInit() {
		//check if logged in
		this.currentUserSub1 = this.userService.getCurrentUser().subscribe(user => {
			if(user == null){
				this.router.navigate(['/authentication']);
				//this.toastr.error("U bent niet ingelogd");
			}
			else{
				this.getPlace();
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
		
		/*
		//if not a date, transform it into a date
		if(Object.prototype.toString.call(defect.last_edited) !== "[object Date]"){
			defect.last_edited = new Date(defect.last_edited.seconds);
		}
		if(defect.repair_date != null && Object.prototype.toString.call(defect.repair_date) !== "[object Date]"){
			defect.repair_date = new Date(defect.repair_date.seconds);
		}
		*/
		
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
		const id = this.route.snapshot.paramMap.get('id');
		this.placeSub = this.placeService.getPlace(id).subscribe(place => {
			this.place = place;
			
			if(place.defects != null){
				//change all timestamps to dates
				for (var i = 0, len = place.defects.length; i < len; i++){
					
					//convert last edited
					if(Object.prototype.toString.call(this.place.defects[i].last_edited) !== "[object Date]"){
						place.defects[i].last_edited = new Date(place.defects[i].last_edited.seconds * 1000);
					}
					
					//convert repair date timestamp to String (check if string only because some old faulty date is still in db)
					if(this.place.defects[i].repair_date != null && Object.prototype.toString.call(this.place.defects[i].repair_date) !== "[object String]"){
						this.place.defects[i].repair_date_string = this.datepipe.transform(new Date((this.place.defects[i].repair_date as any).seconds * 1000), "yyyy-MM-dd");
					}
				
				}
			}
			
			this.defects = place.defects;
			if(this.defects!=null){
				this.defects = this.defects.sort((obj1, obj2) => {
					if (obj1.last_edited < obj2.last_edited) {
						return 1;
					}
				
					if (obj1.last_edited > obj2.last_edited) {
						return -1;
					}
					return 0;
				});
			}
		}, err => {
			this.router.navigate(['/places']);
			this.toastr.error("Gevraagde plaats kon niet gevonden worden");
		});
	}
	
	goBack(): void {
		this.location.back();
	}
	
	save(): void {
		//input checks
		if(this.selectedDefect.status!=1){
			if(this.selectedDefect.repair_date==null || this.selectedDefect.responsible_person=="" || this.selectedDefect.responsible_instance==""){
				this.toastr.error("kijk na of de velden 'reparatiedatum', 'bevoegd persoon' en 'bevoegde instelling' ingevuld zijn");
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
			this.selectedDefect.repair_date = new Date(this.selectedDefect.repair_date_string);
			for (var i = 0, len = this.place.defects.length; i < len; i++){
				if(this.place.defects[i].name == this.selectedDefect.name){
					this.place.defects[i] = this.selectedDefect;
				}
			}
		
			this.placeService.updatePlace(this.place);
		});
	}
	
	ngOnDestroy(){
		
	}

}
