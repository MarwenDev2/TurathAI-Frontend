import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { AuthGuard } from '@core/services/auth.guard';
import { AUTH_ROUTES } from '@views/auth/auth.route';
import { DashboardComponent } from '@views/dashboard/dashboard.component';
import { VIEW_ROUTES } from '@views/views.route';
import { ProfileComponent } from '@views/pages/profile/profile.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        // If no allowed roles are specified or user's role is in the allowed roles, allow access
        const allowedRoles = route.data['roles'] as Array<string>;
        if (!allowedRoles || !allowedRoles.length) return true;
        
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        
        // Redirect ADMIN to dashboard and USER to frontoffice
        if (user) {
          if (user.role === 'ADMIN' && state.url.includes('/frontoffice')) {
            this.router.navigate(['/dashboard']);
          } else if (user.role === 'USER' && !state.url.includes('/frontoffice')) {
            this.router.navigate(['/frontoffice']);
          }
        }
        
        return false;
      })
    );
  }
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'frontoffice',
    loadChildren: () => import('./views/front-office/front-office.module').then(m => m.FrontOfficeModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['USER'] }
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
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
    redirectTo: '' 
  }
];