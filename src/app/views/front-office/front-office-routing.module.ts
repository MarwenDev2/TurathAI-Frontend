import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeLayoutComponent } from './layout/front-office-layout.component';
import { FrontOfficeHomeComponent } from './pages/home/home.component';
import { FrontOfficeItinerariesComponent } from './pages/itineraries/itineraries.component';
import { FrontOfficeProfileComponent } from './pages/profile/profile.component';
import { LocalInsightComponent } from './pages/local-insight/local-insight.component';

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
        path: 'profile',
        component: FrontOfficeProfileComponent,
        data: { title: 'My Profile' }
      },
      {
        path: 'local-insight',
        component: LocalInsightComponent,
        data: { title: 'Local Insights' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }