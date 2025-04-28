// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('AuthGuard checking access to:', state.url);
    
    return this.authService.authStateInitialized().pipe(
      switchMap(() => {
        if (this.authService.isAuthenticated) {
          console.log('Access granted');
          return of(true);
        } else {
          console.log('Access denied - redirecting to login');
          this.authService.setRedirectUrl(state.url);
          return of(this.router.createUrlTree(['/auth/signin']));
        }
      })
    );
  }
}