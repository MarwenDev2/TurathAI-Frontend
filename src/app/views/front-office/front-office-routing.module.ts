import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeLayoutComponent } from './layout/front-office-layout.component';
import { FrontOfficeHomeComponent } from './pages/home/home.component';
import { FrontOfficeItinerariesComponent } from './pages/itineraries/itineraries.component';
import { LocalInsightComponent } from './pages/local-insight/local-insight.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { WishlistComponent } from './pages/Wishlist/wishlist.component';
import { ReviewComponent } from './pages/Reviews/review.component';
import { BusinessListComponent } from './pages/businesses/business-list/business-list.component';
import { HeritageSiteDetailsComponent } from './pages/heritage-sites/details/heritage-site-details.component';
import { HeritageSitesComponent } from './pages/heritage-sites/heritage-sites.component';

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
        component: ProfileComponent,
        data: { title: 'My Profile' }
      },
      {
        path: 'wishlist',
        component: WishlistComponent,
        data: { title: 'Wishlist' }
      },
      {
        path: 'my-reviews',
        component: ReviewComponent,
        data: { title: 'My Reviews' }
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
      },
      {
        path: 'forums',
        loadChildren: () =>
          import('./pages/forums/forums.routes').then((mod) => mod.FORUMS_ROUTES),
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