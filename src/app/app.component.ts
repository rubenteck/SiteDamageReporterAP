import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	
	title = 'AP Reporter';
  
	constructor(public afAuth: AngularFireAuth, public router: Router, private toastr: ToastrService) { }
  
	logout() {
		//unsubscribe
		this.router.navigate(['/authentication']);
		
		//logout
		this.afAuth.auth.signOut().then(
			succces => {
				this.toastr.success("U bent uitgelogd!");
			},
			error => {
				this.toastr.error("Er ging iets mis!");
			}
		);
	}
  
}
