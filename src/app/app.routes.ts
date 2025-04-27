import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { AuthGuard } from '@core/services/auth.guard';
import { AUTH_ROUTES } from '@views/auth/auth.route';
import { DashboardComponent } from '@views/dashboard/dashboard.component';
import { VIEW_ROUTES } from '@views/views.route';
import { ProfileComponent } from '@views/pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        data: { title: 'Dashboard' } 
      },
      { 
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' }
      },
      ...VIEW_ROUTES
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: AUTH_ROUTES
  },
  { 
    path: '**', 
    redirectTo: 'dashboard' 
  }
];