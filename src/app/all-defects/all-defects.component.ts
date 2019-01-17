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
	private router: Router,
	public datepipe: DatePipe
	) { }

	ngOnInit() {
		//check if logged in
		this.currentUserSub1 = this.userService.getCurrentUser().subscribe(user => {
			if(user == null){
				this.router.navigate(['/authentication']);
				//this.toastr.error("U bent niet ingelogd");
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
			
			for (var x = 0; x < places.length; x++){
				if(places[x].defects != null){
					for (var i = 0, len = places[x].defects.length; i < len; i++){
						
						//convert last edited timestamp to Date
						if(Object.prototype.toString.call(places[x].defects[i].last_edited) !== "[object Date]"){
							places[x].defects[i].last_edited = new Date((places[x].defects[i].last_edited as any).seconds * 1000);	//as any cast needed to stop error, console thinks it is a Date
						}
						
						//convert repair date timestamp to String (check if string only because some old faulty date is still in db)
						if(places[x].defects[i].repair_date != null && Object.prototype.toString.call(places[x].defects[i].repair_date) !== "[object String]"){
							places[x].defects[i].repair_date_string = this.datepipe.transform(new Date((places[x].defects[i].repair_date as any).seconds * 1000), "yyyy-MM-dd");
						}
						
						//add place name and id
						places[x].defects[i].place_name = places[x].name;
						places[x].defects[i].place_id = places[x].id;
						
					}
					this.defects = this.defects.concat(places[x].defects);
				}
			}
			
			//remove first defect (empty)
			if(this.defects[0] == null){
				this.defects = this.defects.slice(1);
			}
			
			this.defects = this.defects.sort((obj1, obj2) => {
				if (obj1.last_edited < obj2.last_edited) {
					return 1;
				}
			
				if (obj1.last_edited > obj2.last_edited) {
					return -1;
				}
				return 0;
			});
			
		}, err => {
			this.router.navigate(['/places']);
			this.toastr.error("er ging iets mis");
		});
	}
	
	save(): void {
		//input checks
		if(this.selectedDefect.status!=1){
			if(this.selectedDefect.repair_date_string==null || this.selectedDefect.responsible_person=="" || this.selectedDefect.responsible_instance==""){
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
			this.selectedDefect.repair_date = new Date(this.selectedDefect.repair_date_string);
			this.selectedDefect.status = +this.selectedDefect.status;
			this.selectedDefect.severity = +this.selectedDefect.severity;

			//get place
			for (var x = 0; x < this.places.length; x++){
				if(this.places[x].id == this.selectedDefect.place_id){
					for (var i = 0; i < this.places[x].defects.length; i++){
						if(this.places[x].defects[i].name == this.selectedDefect.name){
							//change defect values
							this.places[x].defects[i] = { ...this.selectedDefect };
							this.place = this.places[x];
							delete this.place.defects[i].place_name;
							delete this.place.defects[i].place_id;
							delete this.place.defects[i].repair_date_string;
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
  