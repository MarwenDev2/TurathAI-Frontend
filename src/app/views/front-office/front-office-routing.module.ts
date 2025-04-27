import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeLayoutComponent } from './layout/front-office-layout.component';
import { FrontOfficeHomeComponent } from './pages/home/home.component';
import { FrontOfficeItinerariesComponent } from './pages/itineraries/itineraries.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeLayoutComponent,
    children: [
      {
        path: '',
        component: FrontOfficeHomeComponent,
        data: { title: 'Home' }
      },
      {
        path: 'itineraries',
        component: FrontOfficeItinerariesComponent,
        data: { title: 'Itineraries' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }