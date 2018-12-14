import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { User } from '../user';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
	
	user: User;

	constructor(public afAuth: AngularFireAuth) { }

	ngOnInit() {
		this.afAuth.authState.subscribe(res => {console.log(res.uid);});
		this.getUserInfo();
	}
  
	getUserInfo(){
		//UserService.getUserInfo().subscribe(user => this.user = user);
	}

}
