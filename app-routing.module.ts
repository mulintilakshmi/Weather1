import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherappComponent } from './weatherapp/weatherapp.component';

const routes: Routes = [
  {
    path:'',component:WeatherappComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
