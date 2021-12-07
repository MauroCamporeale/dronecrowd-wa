import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { MockserviceService } from '../mockservice.service';
import { Result } from '../result';
import {saveAs } from 'file-saver'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  submitted = false;
  predicted = false;
  isLoading = false;
  imageToShow: any;
  originalImage:any;
  mimeType= '';

  formData = new FormData();

  predictForm = new FormGroup ({
    output: new FormControl('', [Validators.required]),
    file: new FormControl('', [Validators.required])
  });


  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  displayedColumns: string[] = ['video_frame', 'count'];
  dataSource: any;

  result: Result = {img_name:'', count:'0', image:'' }; //mock inizialization

  constructor(private router: Router,private mockService: MockserviceService, private messageService: MessageService, private sanitizer: DomSanitizer) { }

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
      if (this.mimeType == 'image/jpeg'){
        this.imageCount();
      }
      else{
        this.videoCount();
      }
    }
    else if(this.predictForm.value.output == 'only people heatmap'){
      this.isLoading = true;
      this.predictAll(false);


    }
    else {
      this.isLoading = true;
      this.predictAll(true);
    }
  }

  imageCount() {
    this.mockService.predictImageCount(this.formData)
        .subscribe(result => this.result = result);
  }

  videoCount() {
    this.mockService.predictVideoCount(this.formData)
        .subscribe(results => this.dataSource = results)
  }

  predictAll(count: boolean) {
    // if (this.mimeType == 'image/jpeg'){
    //   this.mockService.predictImageCount(this.formData).subscribe(result => {
    //     this.result.img_name = result.img_name;
    //     if (count){
    //       this.result.count = result.count;
    //     }
    //     else{
    //       this.result.count = 'People count not Requested';
    //     }
    //   });
    // }
    // else{
    //   if (count){
    //     this.mockService.predictVideoCount(this.formData)
    //       .subscribe(results => this.dataSource = results);
    //   }
    //   else{
    //     this.result.count = 'People count not Requested';
    //   }

    // }

    this.mockService.predictHeatmap(this.formData, this.mimeType)
      .subscribe(
        data => {
          console.log(data.headers);
          console.log(data.headers.keys());
          const keys = data.headers.keys();
          keys.map(key =>
            console.log(data.headers.get(key)));
          console.log(data.body);
          // this.imageToShow= 'assets/whiterabbit-video5.mp4';

          // this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(data.body as File));
          // console.log(this.imageToShow);

          // this.createImageFromBlob(data.body as Blob);
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          console.log(error);
        });
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

      this.mimeType= file.type;

      this.originalImage = file;
      this.formData.append("file",file);
    }
  }

  createImageFromBlob(file: Blob) {
    console.log(typeof(file));
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
       console.log(this.imageToShow);
      //  this.result.image = this.imageToShow;
    }, false);

    if (file) {
       reader.readAsDataURL(file);
    }
 }

}
