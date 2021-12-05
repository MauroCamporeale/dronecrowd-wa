import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apidata } from '../apidata';
import { MessageService } from '../message.service';
import { MockserviceService } from '../mockservice.service';
import { Result } from '../result';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  submitted = false;
  predicted = false;
  count = true;
  heatmap = true;

  binaryFile: string = '';

  predictForm = new FormGroup ({
    output: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required])
  });


  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  result: Result = {image_name:'', count:0, image:'' }; //mock inizialization

  constructor(private router: Router,private mockService: MockserviceService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true; }

  apiRequest() {
    this.predicted = true;
    this.outputOptionSwitch();
    this.getResult();

  }

  outputOptionSwitch(){
    if (this.predictForm.value.output == 'only people count'){
      this.count= true;
      this.heatmap= false;
    }
    else if(this.predictForm.value.output == 'only people heatmap'){
      this.count= false;
      this.heatmap= true;
    }
    else {
      this.count= true;
      this.heatmap= true;
    }
  }

  getResult(): void {



    console.log(this.predictForm.value);
    this.mockService.predict(this.count, this.heatmap, this.binaryFile)
        .subscribe(result => this.result = result);

    //this.mockService.getResult()
        //.subscribe(result => this.result = result);
  }

  onImageChange(e) {
    const reader = new FileReader();

    if(e.target.files && e.target.files.length) {
      const [file] = e.target.files;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.binaryFile = e.target.result.split('base64,')[1];
      };
      reader.readAsDataURL(file);
    }
  }



  // onImageChange(e) {
  //   const reader = new FileReader();

  //   if(e.target.files && e.target.files.length) {
  //     const [file] = e.target.files;
  //     reader.readAsDataURL(file);

  //     reader.onload = () => {
  //       this.imgFile = reader.result as string;
  //       this.uploadForm.patchValue({
  //         imgSrc: reader.result
  //       });
  //     }
  //   }
  // }

}
