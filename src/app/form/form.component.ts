import { DataRowOutlet } from '@angular/cdk/table';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { MockserviceService } from '../mockservice.service';
import { Result } from '../result';

export interface DialogData {
  file: string;
  output: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  predicted = false;
  isLoading = false;
  image = false;
  video = false;
  count = false;
  heatmap = false;
  fileName = "mockname";
  output = 'both people count and heatmap';
  imageToShow: any;
  originalImage:any;
  mimeType= '';

  formData = new FormData();

  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  displayedColumns: string[] = ['video_frame', 'count'];
  dataSource: any;

  result: Result = {img_name:'', count:'0', image:'' }; //mock inizialization

  constructor(private router: Router,private mockService: MockserviceService, private messageService: MessageService, private sanitizer: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: {
        file: this.fileName,
        output: this.output,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.predicted = result;
      this.apiRequest();
    });

  }

  public apiRequest() {
    if (this.predicted){
      this.outputOptionSwitch();
    }
  }

  outputOptionSwitch(){
    if (this.output == 'only people count'){
      if (this.mimeType == 'image/jpeg'){
        this.image = true;
        this.imageCount();
      }
      else{
        this.video = true;
        this.videoCount();
      }
    }
    else if(this.output == 'only people heatmap'){
      if (this.mimeType == 'image/jpeg'){this.image = true;}
      else{this.video = true;}
      this.isLoading = true;
      this.predictAll(false);


    }
    else {
      if (this.mimeType == 'image/jpeg'){this.image = true;}
      else{this.video = true;}
      this.isLoading = true;
      this.predictAll(true);
    }
  }

  imageCount() {
    this.count = true;
    this.mockService.predictImageCount(this.formData)
        .subscribe(result => this.result = result);
  }

  videoCount() {
    this.count = true;
    this.mockService.predictVideoCount(this.formData)
        .subscribe(results => this.dataSource = results)
  }

  predictAll(count: boolean) {
    this.count = count;
    this.heatmap = true;

    if (this.mimeType == 'image/jpeg'){
      this.image = true;
      this.mockService.predictImageCount(this.formData).subscribe(result => {
        this.result.img_name = result.img_name;
        if (count){
          this.result.count = result.count;
        }
        else{
          this.result.count = 'People count not Requested';
        }
      });
    }
    else{
      if (count){
        this.mockService.predictVideoCount(this.formData)
          .subscribe(results => this.dataSource = results);
      }
      else{
        this.result.count = 'People count not Requested';
      }

    }

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

          this.createImageFromBlob(data.body as Blob);
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
      this.fileName = file.name;

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
       this.result.image = this.imageToShow;
    }, false);

    if (file) {
       reader.readAsDataURL(file);
    }
 }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./form.component.css']
})
export class ConfirmDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onEditClick(): void {
    this.dialogRef.close();
  }

}
