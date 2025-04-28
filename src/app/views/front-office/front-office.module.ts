import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FrontOfficeComponent } from './front-office.component';
import { FrontOfficeHomeComponent } from './pages/home/home.component';
import { FrontOfficeLayoutComponent } from './layout/front-office-layout.component';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeItinerariesComponent } from './pages/itineraries/itineraries.component';
import { FrontOfficeProfileComponent } from './pages/profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FrontOfficeRoutingModule,
    // Import standalone components
    FrontOfficeComponent,
    FrontOfficeHomeComponent,
    FrontOfficeLayoutComponent,
    FrontOfficeItinerariesComponent,
    FrontOfficeProfileComponent
  ]
})
export class FrontOfficeModule { }