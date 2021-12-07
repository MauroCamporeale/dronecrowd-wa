import { Injectable } from '@angular/core';
import { Result } from './result';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockserviceService {

  private baseUrl = 'http://localhost:8000/predictions';
  private Url;

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  predictImageCount(body: FormData): Observable<Result> {

    const httpOptions = {
      params: new HttpParams()
        .set('count',true)
        .set('heatmap',false)
    };

    this.Url = this.baseUrl + '/images'

    console.log(body);

    return this.http.post<Result>(this.Url, body, httpOptions).pipe(
      tap((result: Result) => this.log(`submitted for prediction image=${result.img_name}`)),
      catchError(this.handleError<Result>('preditct', {img_name: 'fake_image', count: '49', image:''}))
    );
  }

  predictVideoCount(body: FormData): Observable<Result[]> {

    const httpOptions = {
      params: new HttpParams()
        .set('count',true)
        .set('heatmap',false)
    };

    this.Url = this.baseUrl + '/videos'

    console.log(body);

    return this.http.post<Result[]>(this.Url, body, httpOptions).pipe(
      catchError(this.handleError<Result[]>('preditct', []))
    );
  }

  predictHeatmap(body: FormData, mime: string): Observable<HttpResponse<Blob>> {

    const httpOptions = {
      params: new HttpParams()
        .set('count',true)
        .set('heatmap',true),
      observe: 'response' as const,
      responseType: 'blob' as 'json'
    };

    this.Url = this.baseUrl;

    if (mime == 'image/jpeg'){
      this.Url = this.Url + '/images'
    }
    else{
      this.Url = this.Url + '/videos'
    }

    console.log(body);

    return this.http.post<Blob>(this.Url, body, httpOptions).pipe(
      catchError(this.handleError<HttpResponse<Blob>>())
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

