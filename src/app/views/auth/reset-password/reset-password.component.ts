import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,
    ReactiveFormsModule,LogoBoxComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  token!: string;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.router.navigate(['/auth/signin']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null 
      : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const password = this.form.value.password;

    this.authService.resetPassword(this.token, password).pipe(
      catchError(error => {
        this.errorMessage = error.message;
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(response => {
      if (response) {
        this.successMessage = 'Password has been reset successfully';
        setTimeout(() => {
          this.router.navigate(['/auth/signin']);
        }, 3000);
      }
      this.isLoading = false;
    });
  }
}
