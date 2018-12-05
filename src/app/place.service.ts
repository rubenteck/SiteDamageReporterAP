import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Place } from './place';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
	
	db: AngularFirestore;
	
	constructor(
		private messageService: MessageService,
		db: AngularFirestore
	) {
		db.collection('places').valueChanges();
		this.db = db;
	}
	
	getPlaces(): Observable<any[]> {
		this.messageService.add('PlaceService: fetched places');
		return this.db.collection('places').valueChanges()
			.pipe(
				catchError(this.handleError('getPlaces', []))
			);
	}
	
	
	/**
	* Handle Http operation that failed.
	* Let the app continue.
	* @param operation - name of the operation that failed
	* @param result - optional value to return as the observable result
	*/
	private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
	}
  
	/** Log a HeroService message with the MessageService */
	private log(message: string) {
	this.messageService.add(`HeroService: ${message}`);
	}
  
}
