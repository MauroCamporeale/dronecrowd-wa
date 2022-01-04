import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ResultComponent } from './result/result.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @ViewChild(ResultComponent) resultComp;
  title = 'dronecrowd-wa';

  aboutUs = false;


  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        console.log("small")
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        console.log("big")
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  backToForm(){
    this.resultComp.predicted= false;
    this.resultComp.form.predicted = false;
    this.aboutUs = false;
    this.reload();
  }

  backToResult(){
    this.resultComp.predicted= true;
    this.resultComp.form.predicted = true;
    this.aboutUs = false;
  }

  backToAboutUs(){
    this.aboutUs = true;
  }

  reload(){
    window.location.reload();
  }

}
