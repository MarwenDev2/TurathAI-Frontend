// signin.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { 
  GoogleSigninButtonModule, 
  SocialAuthService, 
  SocialUser, 
  GoogleLoginProvider, 
  FacebookLoginProvider 
} from '@abacritt/angularx-social-login';
import { of } from 'rxjs';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { LoginAvatarComponent } from '../login-avatar/login-avatar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    LogoBoxComponent, 
    RouterLink, 
    FormsModule, 
    GoogleSigninButtonModule,
    ReactiveFormsModule, 
    CommonModule,
    LoginAvatarComponent
  ],
  templateUrl: './signin.component.html',
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 4rem;
      padding: 2rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .form-container {
      max-width: 400px;
      width: 100%;
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }
    
    .logo-large {
      display: block;
      width: 150px;
      height: auto;
      margin: 0 auto;
    }
    
    .avatar-container {
      flex: 1;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      perspective: 1000px;
    }
    
    .avatar-title {
      margin-top: 1.5rem;
      font-size: 1.3rem;
      color: #444;
      text-align: center;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .social-login-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    
    .social-login-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }
    
    .social-login-button.google {
      background-color: #fff;
      color: #757575;
      border: 1px solid #ddd;
    }
    
    .social-login-button.facebook {
      background-color: #3b5998;
      color: white;
      border: 1px solid #3b5998;
    }
    
    .social-login-button.google:hover {
      background-color: #f5f5f5;
      border-color: #ccc;
    }
    
    .social-login-button.facebook:hover {
      background-color: #2d4373;
      border-color: #2d4373;
    }
    
    .or-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 1rem 0;
    }
    
    .or-divider::before,
    .or-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #ddd;
    }
    
    .or-divider span {
      padding: 0 0.75rem;
      color: #757575;
      font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column;
        gap: 2rem;
        padding: 1.5rem;
      }
      
      .avatar-container {
        margin-bottom: 2rem;
      }
      
      .form-container {
        padding: 2rem;
      }
    }
  `]
})
export class SignInComponent implements OnInit {
  private fb = inject(UntypedFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  private socialAuthService = inject(SocialAuthService);

  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  
  // UI state
  isLoading = false;
  errorMessage = '';
  rememberMe = false;
  isPasswordVisible = false;
  isGoogleLoading = false;
  isFacebookLoading = false;
  showHttpsAlert = false;
  avatarState: 'neutral' | 'typing-password' | 'waiting' | 'error' | 'success' = 'neutral';
  avatarMessage = 'Welcome back! Ready to log in?';

  // Forgot password state
  forgotPasswordEmail = '';
  isSendingResetLink = false;
  resetLinkSent = false;
  forgotPasswordError = '';

  ngOnInit(): void {
    this.signInForm.get('email')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      if (value) {
        this.avatarState = 'neutral';
        this.avatarMessage = value.includes('@') ? 'Valid email format!' : 'Enter your email';
      }
    });

    this.signInForm.get('password')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      if (value) {
        this.avatarState = 'typing-password';
        this.avatarMessage = value.length < 6 ? 'Keep going...' : 'Strong password!';
      } else {
        this.avatarState = 'neutral';
        this.avatarMessage = 'Enter your password';
      }
    });
  }

  onEmailFocus(): void {
    this.avatarState = 'neutral';
    this.avatarMessage = 'Enter your email address';
  }

  onPasswordFocus(): void {
    this.avatarState = 'typing-password';
    this.avatarMessage = this.signInForm.get('password')?.value ? 
      'I still won\'t look!' : 'Type your password here';
  }

  onFieldBlur(): void {
    if (!this.signInForm.get('email')?.value && !this.signInForm.get('password')?.value) {
      this.avatarState = 'neutral';
      this.avatarMessage = 'Welcome back! Ready to log in?';
    }
  }

  login(): void {
    if (this.signInForm.invalid) {
      this.avatarState = 'error';
      this.avatarMessage = 'Please fill all fields correctly';
      setTimeout(() => {
        this.avatarState = 'neutral';
      }, 1500);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.avatarState = 'waiting';
    this.avatarMessage = 'Verifying your credentials...';

    const { email, password } = this.signInForm.value;

    this.authService.login(email!, password!, this.rememberMe)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: () => {
          this.avatarState = 'success';
          this.avatarMessage = 'Success! Welcome back!';
          // Navigation is now handled by AuthService
        },
        error: (err) => {
          this.errorMessage = err.message;
          this.avatarState = 'error';
          this.avatarMessage = 'Oops! ' + (err.message || 'Something went wrong');
          setTimeout(() => {
            this.avatarState = this.signInForm.get('password')?.value ? 
              'typing-password' : 'neutral';
            this.avatarMessage = 'Try again';
          }, 2000);
        }
      });
  }

  openForgotPasswordModal(content: any): void {
    this.resetLinkSent = false;
    this.forgotPasswordError = '';
    this.forgotPasswordEmail = this.signInForm.get('email')?.value || '';
    this.modalService.open(content, { centered: true });
  }

  sendResetLink(): void {
    if (!this.forgotPasswordEmail || !this.validateEmail(this.forgotPasswordEmail)) {
      this.forgotPasswordError = 'Please enter a valid email address';
      return;
    }

    this.isSendingResetLink = true;
    this.forgotPasswordError = '';

    this.authService.forgotPassword(this.forgotPasswordEmail).subscribe({
      next: () => {
        this.resetLinkSent = true;
        this.isSendingResetLink = false;
      },
      error: (err) => {
        this.forgotPasswordError = err.message;
        this.isSendingResetLink = false;
      }
    });
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Handle signing in with Google
   */
  signInWithGoogle(): void {
    this.errorMessage = '';
    this.isGoogleLoading = true;
    this.avatarState = 'waiting';
    this.avatarMessage = 'Connecting to Google...';
    
    this.authService.loginWithGoogle().pipe(
      catchError(error => {
        this.errorMessage = error.message || 'Google login failed. Please try again.';
        this.avatarState = 'error';
        this.avatarMessage = 'Google login failed!';
        return of(false);
      }),
      finalize(() => {
        this.isGoogleLoading = false;
      })
    ).subscribe(success => {
      if (success) {
        // The actual auth state handling is done in the AuthService
        console.log('Google sign-in initiated successfully');
      }
    });
  }
  
  /**
   * Handle signing in with Facebook
   */
  signInWithFacebook(): void {
    this.errorMessage = '';
    this.isFacebookLoading = true;
    this.avatarState = 'waiting';
    this.avatarMessage = 'Connecting to Facebook...';
    
    this.authService.loginWithFacebook().pipe(
      catchError(error => {
        this.errorMessage = error.message || 'Facebook login failed. Please try again.';
        this.avatarState = 'error';
        this.avatarMessage = 'Facebook login failed!';
        return of(false);
      }),
      finalize(() => {
        this.isFacebookLoading = false;
      })
    ).subscribe(success => {
      if (success) {
        // The actual auth state handling is done in the AuthService
        console.log('Facebook sign-in initiated successfully');
      }
    });
  }
  
  /**
   * Navigate to reset password page
   */
  resetPassword(): void {
    this.router.navigate(['/auth/reset-password']);
  }

  /**
   * Show HTTPS requirement message for Facebook login
   */
  showHttpsRequiredMessage(): void {
    this.showHttpsAlert = true;
    this.errorMessage = 'Facebook login requires HTTPS. This won\'t work on an HTTP connection.';
    this.avatarState = 'error';
    this.avatarMessage = 'Facebook login requires HTTPS!';
    
    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      this.showHttpsAlert = false;
    }, 5000);
  }
}
