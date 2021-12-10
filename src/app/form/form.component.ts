import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';

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

  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();

  predicted = false;
  originalImage: any;


  fileName = "mockname";
  output = 'both people count and heatmap';
  mimeType= '';


  formData = new FormData();

  outputs = ['only people count', 'only people heatmap',
            'both people count and heatmap'];

  constructor(private router: Router, private messageService: MessageService, public dialog: MatDialog) { }

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
      console.log("scroto")
      this.parentFun.emit();
    }
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
      this.formData.append("file",file);
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
