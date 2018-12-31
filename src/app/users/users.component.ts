import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { User } from '../user';

import { UserService } from '../user.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
	
	users: User[];
	selectedUser;
	usersSub;
	currentUserSub;
	userSub;

  constructor(private router: Router, private userService: UserService, private toastr: ToastrService) { }

	ngOnInit() {
		//check if admin
		this.currentUserSub = this.userService.getCurrentUser().subscribe(user => {
			if(user == null){
				this.router.navigate(['/authentication']);
				this.toastr.error("u bent niet ingelogd");
				return;
			}
			this.userSub = this.userService.getUser(user.uid).subscribe(user => {
				//console.log(user);
				if(user.admin != true){
					//then return to places
					this.router.navigate(['/places']);
					this.toastr.error("you are not an admin");
				}
				else{
					//else get users
					this.getUsers();
				}
			});
		});
	}

	onSelect(user: User): void {
		this.selectedUser = user;
	}
	
	getUsers(){
		this.usersSub = this.userService.getUsers().subscribe(users => this.users = users);
	}
	
	save(): void {
		//update data
		if(this.selectedUser.active == "true"){
			this.selectedUser.active = true;
		}
		
		if(this.selectedUser.active == "false"){
			this.selectedUser.active = false;
		}
		
		if(this.selectedUser.admin == "true"){
			this.selectedUser.admin = true;
		}
		
		if(this.selectedUser.admin == "false"){
			this.selectedUser.admin = false;
		}
		//console.log(this.selectedUser);
		
		//save user
		this.userService.updateUser(this.selectedUser);
	}
	
	ngOnDestroy(){
		
	}
	
}
