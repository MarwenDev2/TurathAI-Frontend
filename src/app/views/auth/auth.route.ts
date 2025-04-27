import { Route } from '@angular/router';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordComponent } from './password/password.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'signin',
    component: SignInComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'password',
    component: PasswordComponent
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  { 
    path: 'reset-password', 
    component: ResetPasswordComponent 
  }
];