import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
	itemDoc: AngularFirestoreDocument<User>;
	private userCollection: AngularFirestoreCollection<User>;
	users: Observable<User[]>;
	
	constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private toastr: ToastrService) { }
  
	getCurrentUser(): Observable<any>{
		return this.afAuth.authState;
	}
	
	getUser(uid: string): Observable<User>{
		return this.db.doc<User>('users/' + uid).valueChanges();
	}
	
	getUsers(): Observable<User[]>{
		this.userCollection = this.db.collection<User>('users');
		this.users = this.userCollection.snapshotChanges().map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as User;
				//console.log(data);
				const id = a.payload.doc.id;
				return { id, ...data };
			});
		});
		return this.users;
	}
	
	updateUser(user: User){
		this.itemDoc = this.db.doc<User>('users/' + user.uid);
		this.itemDoc.set(user, {merge:true}).then(
			succes => {
				this.toastr.success("Opgeslagen!");
			},
			error => {
				this.toastr.error("Er ging iets mis!");
				console.log(error);
			}
		);
	}
	
}