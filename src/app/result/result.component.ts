import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormComponent } from '../form/form.component';
import { MockserviceService } from '../mockservice.service';
import { Result } from '../result';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @ViewChild(FormComponent) form;

  isLoading = false;
  image = false;
  video = false;
  count = false;
  heatmap = false;

  dataSource: any;
  fileUrl: any;
  imageToShow: any;
  fileName: string = "";

  mimeType: string ="";
  originalImage:any;
  formData:any;
  output: string ="";
  predicted: boolean = false;

  displayedColumns: string[] = ['video_frame', 'count'];
  result: Result = {img_name:'', count:'0', image:'' }; //mock inizialization

  constructor(private mockService: MockserviceService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }



  passData() {
    this.isLoading = false;
    this.image = false;
    this.video = false;
    this.count = false;
    this.heatmap = false;

    this.originalImage = this.form.originalImage;
    this.formData = this.form.formData;
    this.output = this.form.output;
    this.mimeType = this.formData.get("file").type;
    this.fileName = this.formData.get("file").name;
    this.predicted = this.form.predicted;

    console.log(this.originalImage);
    console.log(this.formData);
    console.log(this.output);
    console.log(this.predicted);

    this.outputOptionSwitch();
  }

  outputOptionSwitch(){
    this.isLoading = true;
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
      this.predictAll(false);


    }
    else {
      if (this.mimeType == 'image/jpeg'){this.image = true;}
      else{this.video = true;}
      this.predictAll(true);
    }
  }

  imageCount() {
    this.count = true;
    this.mockService.predictImageCount(this.formData)
        .subscribe(result => {
          this.result = result;
          this.isLoading = false;
        });
  }

  videoCount() {
    this.count = true;
    this.mockService.predictVideoCount(this.formData)
        .subscribe(results => {
          this.dataSource = results;
          this.isLoading = false;
        });
  }

  predictAll(count: boolean) {
    this.count = count;
    this.heatmap = true;

    this.mockService.predictHeatmap(this.formData, this.mimeType)
      .subscribe(
        data => {
          this.isLoading = false;

          if (this.mimeType == 'image/jpeg'){
            this.image = true;

            this.createImageFromBlob(data.body as Blob);

            if (count){
              this.result.count = data.headers.get('count') as string
            }
            else{
              this.result.count = 'People count not Requested';
            }
          }
          else{

            this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data.body as Blob));

            if (count){

              let results: Result[] = []

              for (let index = 0; index < Number(data.headers.get("n_frames")); index++) {

                results.push({
                  count: String(index),
                  video_frame: data.headers.get(String(index)) as string
                });

              }

              this.dataSource = results;
              console.log(this.dataSource)

            }
            else{
              this.result.count = 'People count not Requested';
            }

          }

        },
        error => {
          this.isLoading = false;
          console.log(error);
        });
  }

  createImageFromBlob(file: Blob) {
    console.log(typeof(file));
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
       this.result.image = this.imageToShow;
    }, false);

    if (file) {
       reader.readAsDataURL(file);
    }
 }

}
