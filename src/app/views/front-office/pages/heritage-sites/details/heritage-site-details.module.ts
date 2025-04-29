import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeritageSiteDetailsComponent } from './heritage-site-details.component';
import { RouterModule } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { HeritageSiteImageComponent } from './components/site-image/site-image.component';
import { HeritageSiteInfoComponent } from './components/site-info/site-info.component';
import { SiteItineraryComponent } from './components/site-itinerary/site-itinerary.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbRatingModule,
    FormsModule,
    HttpClientModule,
    HeritageSiteDetailsComponent,
    HeritageSiteImageComponent,
    HeritageSiteInfoComponent,
    SiteItineraryComponent
  ],
  exports: [HeritageSiteDetailsComponent]
})
export class HeritageSiteDetailsModule { }