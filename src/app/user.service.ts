import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
	doc: AngularFirestoreDocument<User>;
	user: Observable<User>;
	
	constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) { }
  
	getCurrentUser(): Observable<User>{
		return this.afAuth.authState;
	}
	
	getUser(uid: string): Observable<User>{
		
		this.doc = this.db.doc<User>('users/' + uid);
		this.user = this.doc.valueChanges();

		return this.user;
	}
}