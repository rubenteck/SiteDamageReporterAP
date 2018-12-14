import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

	email: string;
	password: string;

	constructor(public afAuth: AngularFireAuth) { }

	ngOnInit() {
	}
  
	login(){
		this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password);
	}
  
	loginGoogle() {
		this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
	}
  
	newUser(){
		this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password);
	}

}
