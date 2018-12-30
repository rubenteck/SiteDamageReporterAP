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
	
	title = 'DamageReporter AP';
  
	constructor(public afAuth: AngularFireAuth, public router: Router, private toastr: ToastrService) { }
  
	logout() {
		//unsubscribe
		
		
		//logout
		this.afAuth.auth.signOut().then(
			succces => {
				this.toastr.success("u bent uitgelogd!");
				this.router.navigate(['/authentication']);
			},
			error => {
				this.toastr.error("er ging iets mis!");
			}
		);
	}
  
}
