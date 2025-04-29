import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeLayoutComponent } from './layout/front-office-layout.component';
import { FrontOfficeHomeComponent } from './pages/home/home.component';
import { FrontOfficeItinerariesComponent } from './pages/itineraries/itineraries.component';
import { HeritageSitesComponent } from './pages/heritage-sites/heritage-sites.component';
import { HeritageSiteDetailsComponent } from './pages/heritage-sites/details/heritage-site-details.component';
import { BusinessListComponent } from './pages/businesses/business-list/business-list.component';

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
      },
      {
        path: 'heritage-sites',
        component: HeritageSitesComponent
      },
      {
        path: 'heritage-sites/details/:id',
        component: HeritageSiteDetailsComponent
      },
      {
        path: 'businesses',
        component: BusinessListComponent,
        data: { title: 'Local Businesses' }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }