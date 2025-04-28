import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'
import { Store } from '@ngrx/store';
import { login } from '@store/authentication/authentication.actions';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [LogoBoxComponent,RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styles: ``
})
export class SigninComponent {
  signInForm!: UntypedFormGroup
  submitted: boolean = false

  public fb = inject(UntypedFormBuilder)
  public store = inject(Store)

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['demo@demo.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
    })
  }

  get formValues() {
    return this.signInForm.controls
  }

  login() {
    this.submitted = true
    if (this.signInForm.valid) {     
      const email = this.formValues['email'].value // Get the username from the form
      const password = this.formValues['password'].value // Get the password from the form

      // Login Api
      this.store.dispatch(login({ email: email, password: password }))
    }
  }
}
