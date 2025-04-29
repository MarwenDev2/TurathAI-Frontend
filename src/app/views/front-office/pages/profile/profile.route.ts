import { Route } from '@angular/router';
import { FrontOfficeProfileComponent } from './profile.component';

export const FRONT_OFFICE_PROFILE_ROUTES: Route[] = [
  {
    path: '',
    component: FrontOfficeProfileComponent,
    title: 'User Profile'
  }
];
