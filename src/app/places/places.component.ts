import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Place } from '../place';

import { PlaceService } from '../place.service';
import { UserService } from '../user.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
	
	placesSub;
	places: Place[];
	currentUserSub;
	
	constructor(private placeService: PlaceService, private userService: UserService, private router: Router, private toastr: ToastrService) { }

	ngOnInit() {
		//check if logged in
		this.currentUserSub = this.userService.getCurrentUser().subscribe(user => {
			if(user == null){
				this.router.navigate(['/authentication']);
				//this.toastr.error("U bent niet ingelogd");
			}
			else{
				this.getPlaces();
			}
		});
	}
	
	getPlaces(): void {
		this.placesSub = this.placeService.getPlaces().subscribe(places => this.places = places);
	}
	
	ngOnDestroy() {

	}
	
}
