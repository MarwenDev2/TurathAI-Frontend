import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@core/services/auth.service';
import { RouterLink } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'password',
  imports: [RouterLink,LogoBoxComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './password.component.html',
  styles: ``
})
export class PasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.passwordForm.invalid || this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      this.toastr.error("Passwords do not match or are invalid");
      return;
    }

    this.isSubmitting = true;
    const user = this.authService.getStoredUser();
    if (!user) {
      this.toastr.error("User not found. Please log in again.");
      this.isSubmitting = false;
      return;
    }

    const payload = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(user.id, payload).subscribe({
      next: () => {
        this.toastr.success("Password updated successfully");
        this.passwordForm.reset();
        this.isSubmitting = false;
      },
      error: err => {
        this.toastr.error(err.message || "Failed to change password");
        this.isSubmitting = false;
      }
    });
  }
}