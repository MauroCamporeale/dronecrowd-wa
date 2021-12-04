import { Injectable } from '@angular/core';
import { Result } from './result';
import { FAKERESULT } from './mock-result';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockserviceService {

  private resultUrl = 'api/result';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getResult(): Observable<Result>{
    return this.http.get<Result>(this.resultUrl)
      .pipe(
        tap(_ => this.log('fetched result')),
        catchError(this.handleError<Result>('getResult', {image_name: 'fake_image', count: 49, image:''} ))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add('MockService: ${message}');
  }



}
