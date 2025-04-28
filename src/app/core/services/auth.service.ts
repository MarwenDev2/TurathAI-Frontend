import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, from, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '@core/Models/user';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'turathai_auth_token';
  private readonly USER_KEY = 'turathai_user_data';
  private readonly API_URL = 'http://localhost:9090/api/auth';
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private userSubject = new BehaviorSubject<User | null>(null);
  private authStateChecked = false;

  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookieService);
  private socialAuthService = inject(SocialAuthService);
  private redirectUrl: string | null = null;
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<any>(null);

  constructor() {
    this.initializeAuthState();
    
    // Listen for social login events
    this.socialAuthService.authState.subscribe((socialUser) => {
      if (socialUser) {
        this.handleSocialLogin(socialUser).subscribe();
      }
    });
  }
  updateCurrentUser(user: User): void {
    this.userSubject.next(user);
    
    // Update storage if needed
    const rememberMe = !!localStorage.getItem(this.TOKEN_KEY);
    if (rememberMe) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
  
  getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY) || 
                    sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  private initializeAuthState(): void {
    const token = this.getTokenStorage();
    
    if (token && this.isValidToken(token)) {
      this.tokenSubject.next(token);
      
      // Try to get user from storage first
      const storedUser = this.getUserStorage();
      if (storedUser) {
        this.userSubject.next(storedUser);
      }
      
      // Still fetch fresh data but don't wait for it
      this.fetchUserData().subscribe();
    } else {
      this.clearAuthState();
    }
    this.authStateChecked = true;
  }

  private fetchUserData(): Observable<User | null> {
    const token = this.currentToken;
    if (!token) return of(null);
  
    const email = this.extractEmailFromToken(token);
    if (!email) return of(null);
  
    return this.http.get<User>(`http://localhost:9090/api/users/email/${email}`).pipe(
      tap(user => {
        const rememberMe = !!localStorage.getItem(this.TOKEN_KEY);
        this.userSubject.next(user);
        this.setUserStorage(user, rememberMe);
        
        if (user?.id) {
          localStorage.setItem('userId', user.id.toString());
        }
        this.redirectAfterLogin();
      }),
      catchError(error => {
        console.error('Failed to fetch user data', error);
        return of(null);
      })
    );
  }
  private clearAuthState(): void {
    this.tokenSubject.next(null);
    this.userSubject.next(null);
    this.cookieService.delete(this.TOKEN_KEY, '/');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('userId');
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }
  
  // Add method to get user from storage
  private getUserStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
  
  // Add method to set user in storage
  private setUserStorage(user: User, rememberMe: boolean): void {
    const userJson = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(this.USER_KEY, userJson);
      sessionStorage.removeItem(this.USER_KEY);
    } else {
      sessionStorage.setItem(this.USER_KEY, userJson);
      localStorage.removeItem(this.USER_KEY);
    }
  }
  private scheduleTokenRefresh(expirationTime: number): void {
    const now = Date.now();
    const expiresIn = expirationTime * 1000 - now;
    const refreshTime = expiresIn - (5 * 60 * 1000); // Refresh 5 minutes before expiration
  
    if (refreshTime > 0) {
      setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshTime);
    }
  }
  
  private refreshToken(): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.API_URL}/refresh`, {}).pipe(
      tap(response => {
        const rememberMe = !!localStorage.getItem(this.TOKEN_KEY);
        this.handleAuthSuccess(response.token, rememberMe);
      }),
      catchError(error => {
        this.clearAuthState();
        return throwError(() => new Error('Session expired. Please login again.'));
      })
    );
  }
  
  private handleAuthSuccess(token: string, rememberMe: boolean): void {
    this.tokenSubject.next(token);
    this.setTokenStorage(token, rememberMe);
    
    // If we have user data, persist it with the same rememberMe setting
    if (this.currentUser) {
      this.setUserStorage(this.currentUser, rememberMe);
    }
    
    // Schedule token refresh
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.scheduleTokenRefresh(payload.exp);
  }

  private redirectAfterLogin(): void {
    const redirectUrl = this.redirectUrl || this.getDefaultRouteForUser();
    this.router.navigateByUrl(redirectUrl).then(() => {
      this.redirectUrl = null; // Clear the stored URL after redirection
    });
  }

  private getDefaultRouteForUser(): string {
    const user = this.currentUser;
    if (!user) return '/dashboard';
    
    return user.role === 'ADMIN' ? '/dashboard' : '/frontoffice';
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  private extractEmailFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (e) {
      console.error('Error parsing token', e);
      return null;
    }
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<boolean> {
    return this.http.post<{token: string}>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token, rememberMe);
      }),
      switchMap(() => this.fetchUserData().pipe(
        map(user => {
          if (!user) {
            throw new Error('Failed to load user data');
          }
          // Ensure user is stored with correct rememberMe setting
          this.setUserStorage(user, rememberMe);
          return true;
        })
      )),
      catchError(error => {
        let errorMsg = 'Login failed';
        if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 403) {
          errorMsg = 'Invalid credentials';
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  register(userData: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.API_URL}/register`, userData).pipe(
      tap(response => {
        if (response?.token) {
          // Login user with the token after successful registration
          this.handleAuthSuccess(response.token, false);
          this.fetchUserData().subscribe(); // Ensure user data is fetched
        }
      }),
      catchError(error => {
        // Re-throw error to be handled in the component
        return throwError(() => error);
      })
    );
  }
  
  
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/auth/signin']);
  }

  private getTokenStorage(): string | null {
    // Check localStorage first (for "remember me"), then sessionStorage
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  private setTokenStorage(token: string, rememberMe: boolean): void {
    if (rememberMe) {
      localStorage.setItem(this.TOKEN_KEY, token);
      sessionStorage.removeItem(this.TOKEN_KEY);
    } else {
      sessionStorage.setItem(this.TOKEN_KEY, token);
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  private clearTokenStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }

  get currentUser$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    const token = this.currentToken;
    return !!token && this.isValidToken(token);
  }

  authStateInitialized(): Observable<boolean> {
    if (this.authStateChecked) {
      return of(true);
    }
    return this.tokenSubject.pipe(
      filter(() => this.authStateChecked),
      take(1),
      map(() => true)
    );
  }
  
  private isValidToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isValid = payload.exp > Date.now() / 1000;
      if (!isValid) {
        console.warn('Token expired at', new Date(payload.exp * 1000));
      }
      return isValid;
    } catch {
      return false;
    }
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshSubject.next(null);

        return this.refreshToken().pipe(
            switchMap((token: any) => {
                this.isRefreshing = false;
                this.refreshSubject.next(token);
                return next.handle(this.addToken(request, token.token));
            }),
            catchError(err => {
                this.isRefreshing = false;
                this.clearAuthState();
                return throwError(() => err);
            })
        );
    } else {
        return this.refreshSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
                return next.handle(this.addToken(request, token.token));
            })
        );
    }
}

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
      return request.clone({
          setHeaders: {
              'Authorization': `Bearer ${token}`
          }
      });
  }
  

  forgotPassword(email: string): Observable<any> {
    const url = `${this.API_URL}/forgot-password?email=${encodeURIComponent(email)}`;
    return this.http.post(url, null).pipe( // null or {} as body
      catchError(error => {
        let errorMsg = 'Failed to send reset email';
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, newPassword }).pipe(
      catchError(error => {
        let errorMsg = 'Failed to reset password';
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  
  /**
   * Handle social login with Google, Facebook, etc.
   * @param socialUser The user data from social login provider
   */
  private handleSocialLogin(socialUser: SocialUser): Observable<boolean> {
    // Send social user data to the backend for authentication/registration
    return this.http.post<{token: string}>(`${this.API_URL}/social-login`, {
      providerId: socialUser.provider,
      providerUserId: socialUser.id,
      email: socialUser.email,
      firstName: socialUser.firstName,
      lastName: socialUser.lastName,
      photoUrl: socialUser.photoUrl
    }).pipe(
      tap(response => {
        this.handleAuthSuccess(response.token, true); // Use rememberMe by default for social login
      }),
      switchMap(() => this.fetchUserData().pipe(
        map(user => {
          if (!user) {
            throw new Error('Failed to load user data after social login');
          }
          return true;
        })
      )),
      catchError(error => {
        console.error('Social login error:', error);
        let errorMsg = 'Social login failed';
        if (error.error?.message) {
          errorMsg = error.error.message;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
  
  /**
   * Initiate Google login process
   */
  loginWithGoogle(): Observable<boolean> {
    return from(this.socialAuthService.signIn('GOOGLE')).pipe(
      // The actual login processing is handled by the authState subscription in constructor
      map(() => true), // Convert SocialUser to boolean
      catchError(error => {
        console.error('Google login error:', error);
        return throwError(() => new Error('Google login failed. Please try again.'));
      })
    );
  }
  
  /**
   * Initiate Facebook login process
   */
  loginWithFacebook(): Observable<boolean> {
    return from(this.socialAuthService.signIn('FACEBOOK')).pipe(
      // The actual login processing is handled by the authState subscription in constructor
      map(() => true), // Convert SocialUser to boolean
      catchError(error => {
        console.error('Facebook login error:', error);
        return throwError(() => new Error('Facebook login failed. Please try again.'));
      })
    );
  }
  
  /**
   * Sign out from social providers as well as our app
   */
  logoutSocial(): Observable<void> {
    return from(this.socialAuthService.signOut(true)).pipe(
      tap(() => {
        this.logout();
      }),
      catchError(error => {
        // Still logout from our app even if social logout fails
        console.error('Error during social logout:', error);
        this.logout();
        return of(void 0);
      })
    );
  }
}