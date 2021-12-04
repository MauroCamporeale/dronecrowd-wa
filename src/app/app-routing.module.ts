import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsInfoComponent } from './results-info/results-info.component';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: 'form', component: FormComponent},
  { path: 'result', component: ResultsInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
