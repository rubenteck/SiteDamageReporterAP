import { Component, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {

	email: string = "";
	password: string = "";

	constructor(public afAuth: AngularFireAuth, public router: Router, private toastr: ToastrService, private _ngZone: NgZone) { }

	login(){
		if(this.email == "" || this.password == ""){
			this.toastr.error("Vul je e-mailadres en wachtwoord in");
			return;
		}
		
		this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(
			succes => {
				//this.toastr.success("U bent succesvol ingelogd!");
				this.router.navigate(['/places']);
			},
			error => {
				this.toastr.error("Inloggen mislukt");
				console.log(error);
			}
		);
	}
  
	loginGoogle() {
		this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(
			succes => {
				this._ngZone.run(() => {
					//this.toastr.success("U bent succesvol ingelogd!");
					this.router.navigate(['/places']);
				});
			},
			error => {
				this.toastr.error("Inloggen mislukt");
				console.log(error);
			}
		);
	}

}
