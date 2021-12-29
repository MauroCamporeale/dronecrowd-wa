import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../api.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  authors = [
    new Author('MauroCamporeale', 'Camporeale Mauro', '****** le bambine nel sonno'),
    new Author('sergiocaputo', 'Caputo Sergio', 'Sergio mettiti una bio su Github'),
    new Author('pasqualedem', 'De Marinis Pasquale', 'Venditore ambulante non tanto regolare'),
    new Author('AlessiaLa', 'Laforgia Alessia', 'Compra misture di gaussiane nel deep web')
  ]

  constructor(private route: ActivatedRoute, private apiService: ApiserviceService) { }

  ngOnInit(): void {

    for (let index = 0; index < this.authors.length; index++) {

      this.getUser(this.authors[index].gitName as string, index);
      this.getUserRepos(this.authors[index].gitName as string, index);

    }

    console.log(this.authors)

  }



  getUser(name: string, id: number){
    this.apiService.getUser(name)
        .subscribe(response => {
          console.log(response)
          if(response['bio'])
            this.authors[id].info = response['bio'];
          if(response['html_url'])
            this.authors[id].gitLink = response['html_url'];
          if(response['followers'])
            this.authors[id].followers = response['followers'];
        });
  }

  getUserRepos(name: string, id: number){
    this.apiService.getUserRepos(name)
      .subscribe(response => {
        console.log(response)
        if(response){
          response.forEach(element => {
            let repo = new Repo(element['name'], element['html_url'])
            console.log(repo)
            this.authors[id].repos?.push(repo)
          });
        }
      })
  }

}

export class Author {
  gitName?: string;
  name?: string;
  info?: string;
  followers?: number;
  gitLink?: string;
  repos?: Repo[] = []

  constructor(gitName: string, name: string, info: string) {
    this.gitName = gitName
    this.name = name
    this.info = info
  }

}

export class Repo {
  name?: string;
  git_url?: string;

  constructor(name: string, git_url: string) {
    this.name = name
    this.git_url = git_url
  }

}
