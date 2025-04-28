import { Route } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const FRONT_OFFICE_PROFILE_ROUTES: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    title: 'User Profile'
  }
];
