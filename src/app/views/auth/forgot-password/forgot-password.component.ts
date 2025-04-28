import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule,
    ReactiveFormsModule,LogoBoxComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const email = this.form.value.email ?? '';

    this.authService.forgotPassword(email).pipe(
      catchError(error => {
        this.errorMessage = error.message;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.successMessage = 'Password reset link has been sent to your email';
      }
      this.isLoading = false;
    });
  }
}
