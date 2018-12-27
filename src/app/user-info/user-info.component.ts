import { Component, OnInit } from '@angular/core';

import { User } from '../user';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
	
	user: User;

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.getUserInfo();
	}
  
	getUserInfo(){
		this.userService.getCurrentUser().subscribe(user => this.user = user);
	}

}
