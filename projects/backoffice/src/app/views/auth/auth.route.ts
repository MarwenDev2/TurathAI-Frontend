import { Route } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordComponent } from './password/password.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'signin',
    component: SigninComponent,
    data: { title: 'Sign In' },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: { title: 'Sign Up' },
  },
  {
    path: 'password',
    component: PasswordComponent,
    data: { title: 'Reset Password' },
  },
  {
    path: 'lock-screen',
    component: LockScreenComponent,
    data: { title: 'Lock Screen' },
  },
];
