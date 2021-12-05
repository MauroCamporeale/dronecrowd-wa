import { Injectable } from '@angular/core';
import { Result } from './result';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockserviceService {

  private resultUrl = 'api/result';  // URL to web api
  private baseUrl = 'http://localhost:8000/predictions/images';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  predict2(): Observable<Result>{
    return this.http.get<Result>('http://localhost:8000/')
      .pipe(
        tap(_ => this.log('fetched result')),
        catchError(this.handleError<Result>('getResult', {image_name: 'fake_image', count: 49, image:''} ))
      );

  }


  predict(count: boolean, heatmap: boolean, file: string): Observable<Result> {

    const httpOptions = {
      params: new HttpParams()
        .set('count',count)
        .set('heatmap',heatmap)
    };

    console.log(file);

    return this.http.post<Result>(this.baseUrl, "files = [('file': ('image.jpg'," + file + ", 'image/jpeg'))]", httpOptions).pipe(
      tap((result: Result) => this.log(`submitted for prediction image=${result.image_name}`)),
      catchError(this.handleError<Result>('preditct', {image_name: 'fake_image', count: 49, image:''}))
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
