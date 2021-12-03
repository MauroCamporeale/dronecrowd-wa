import { Injectable } from '@angular/core';
import { Result } from './result';
import { FAKERESULT } from './mock-result';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockserviceService {

  constructor() { }

  getResult(): Observable<Result>{
    const result = of(FAKERESULT)
    return result;
  }
}
