import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const result = {
      image_name: 'image_prova_server',
      count: 420,
      image: '../../assets/image.jpg' //this has to be a file
    };
    return {result};
  }
}
