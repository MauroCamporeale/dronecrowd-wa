import { Component, OnInit } from '@angular/core';
import { Apidata } from '../apidata';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  submitted = false;
  count = true;
  heatmap = true;

  model = new Apidata('mockfile', 'mockoutput', 'mockpath');

  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
     this.submitted = true; }

}
