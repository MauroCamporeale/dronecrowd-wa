import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  authors = [
    new Author('', 'Camporeale Mauro', '****** le bambine nel sonno'),
    new Author('', 'Caputo Sergio', 'Trafficante di *****'),
    new Author('https://avatars.githubusercontent.com/u/45567509?s=400&u=aedd42ed676631e8de29b6f3ac0a838d92b5b797&v=4',
     'De Marinis Pasquale', 'Venditore ambulante non tanto regolare'),
    new Author('', 'Laforgia Alessia', 'Compra misture di gaussiane nel deep web')
  ]

}

export class Author {
  imageUrl?: string;
  name?: string;
  info?: string

  constructor(imageUrl: string, name: string, info: string) {
    this.imageUrl = imageUrl
    this.name = name
    this.info = info
  }
}