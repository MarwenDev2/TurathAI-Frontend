import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/services/auth.guard';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { LayoutComponent } from '@layouts/layout/layout.component';
import { AUTH_ROUTES } from '@views/auth/auth.route';
import { DashboardComponent } from '@views/dashboard/dashboard.component';
import { ProfileComponent } from '@views/pages/profile/profile.component';
import { VIEW_ROUTES } from '@views/views.route';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule {}
