import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { FormComponent } from './form/form.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: 'form', component: FormComponent},
  { path: 'result', component: ResultComponent},
  { path: 'aboutus', component: AboutusComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
