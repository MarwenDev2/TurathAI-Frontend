import { Injectable } from '@angular/core';
import { 
  HttpInterceptor, 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpResponse,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Intercepting request to:', request.url);
    
    // Skip auth header for auth-related endpoints
    if (request.url.includes('/api/auth/')) {
      return next.handle(request);
    }
    
    // Get token directly from storage
    const token = localStorage.getItem('turathai_auth_token') || 
                 sessionStorage.getItem('turathai_auth_token');
    
    if (token) {
      console.log('Adding auth token to request');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('Response received:', event.url, event.status);
          }
        },
        error: (err) => {
          console.error('HTTP error:', err);
          if (err instanceof HttpErrorResponse && err.status === 401) {
            // Clear auth data and redirect to login
            localStorage.removeItem('turathai_auth_token');
            sessionStorage.removeItem('turathai_auth_token');
            this.router.navigate(['/auth/signin']);
          }
        }
      })
    );
  }
}