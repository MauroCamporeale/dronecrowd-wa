import { Component, OnInit } from '@angular/core';
import { Result } from '../result';
import { MockserviceService } from '../mockservice.service';

@Component({
  selector: 'app-results-info',
  templateUrl: './results-info.component.html',
  styleUrls: ['./results-info.component.css']
})
export class ResultsInfoComponent implements OnInit {

  fileReader = new FileReader;

  result: Result = {image_name:'', count:0, image:'' }; //mock inizialization


  constructor(private mockService: MockserviceService) { }

  ngOnInit(): void {
    this.getResult();
  }

  getResult(): void {
    this.mockService.getResult()
        .subscribe(result => this.result = result);
  }

}
