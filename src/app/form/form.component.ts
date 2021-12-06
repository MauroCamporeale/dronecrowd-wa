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
  isImageLoading = false;
  imageToShow: any;
  originalImage: any;

  formData = new FormData();

  predictForm = new FormGroup ({
    output: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required])
  });


  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  result: Result = {img_name:'', count:'0', image:'' }; //mock inizialization

  constructor(private router: Router,private mockService: MockserviceService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true; }

  apiRequest() {
    this.predicted = true;
    this.outputOptionSwitch();

  }

  outputOptionSwitch(){
    if (this.predictForm.value.output == 'only people count'){
      this.mockService.predictOnlyCount(this.formData)
        .subscribe(result => this.result = result);
    }
    else if(this.predictForm.value.output == 'only people heatmap'){
      this.isImageLoading = true;
      this.result.count = 'People count not Requested'
      this.mockService.predictOnlyCount(this.formData)
        .subscribe(result => this.result.img_name = result.img_name);
      this.mockService.predictOnlyHeatmap(this.formData)
         .subscribe(
            data => {
              this.createImageFromBlob(data);
              this.isImageLoading = false;
            },
            error => {
              this.isImageLoading = false;
              console.log(error);
            });
    }
    else {
      console.log(this.predictForm.value);
      this.isImageLoading = true;
      this.mockService.predictOnlyCount(this.formData)
        .subscribe(result => this.result = result);
      this.mockService.predictOnlyHeatmap(this.formData)
         .subscribe(
            data => {
              this.createImageFromBlob(data);
              this.isImageLoading = false;
            },
            error => {
              this.isImageLoading = false;
              console.log(error);
            });
    }
  }

  onImageChange(e) {
    const reader = new FileReader();

    if(e.target.files && e.target.files.length) {
      const file: File = e.target.files[0];

      let reader = new FileReader();
      reader.addEventListener("load", () => {
        this.originalImage = reader.result;
      }, false);

      if (file) {
        reader.readAsDataURL(file);
     }

      this.originalImage = file;
      this.formData.append("file",file);
    }
  }

  createImageFromBlob(image: Blob) {
    console.log(typeof(image));
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
       this.result.image = this.imageToShow;
    }, false);

    if (image) {
       reader.readAsDataURL(image);
    }
 }

}
