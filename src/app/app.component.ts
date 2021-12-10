import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  title = 'dronecrowd-wa';


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

}
