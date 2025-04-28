import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LogoBoxComponent } from '@component/logo-box.component';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { languages } from './language';
import { countries } from './countries';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [LogoBoxComponent, RouterLink, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form initialization with proper types
  signUpForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
  lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
  email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
  password: ['', [
    Validators.required, 
    Validators.minLength(8),
    Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
  ]],
    originCountry: ['', Validators.required], // Will store full country name
    spokenLanguages: [[] as string[], Validators.required], // Will store language codes temporarily
    interests: ['', [Validators.required, Validators.maxLength(200)]],
    role: ['USER'],
    image: [null as string | null],
    createdAt: [new Date()]
  });

  // UI State
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  acceptTerms = false;
  selectedImage: string | ArrayBuffer | null = null;
  showCountryDropdown = false;
  showLanguageDropdown = false;
  languageSearchTerm = '';
  countrySearchTerm = '';
  imageFileName: string | null = null;
  
  // Data
  countries = countries;
  languages = languages;
  filteredCountries = [...countries];
  filteredLanguages = [...languages];

  constructor() {
    // Initialize spokenLanguages as empty array
    this.signUpForm.get('spokenLanguages')?.setValue([]);
  }

  // Filter countries based on search term
  filterCountries(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  // Filter languages based on search term
  filterLanguages() {
    this.filteredLanguages = this.languages.filter(lang =>
      lang.name.toLowerCase().includes(this.languageSearchTerm.toLowerCase())
    );
  }

  // Select country
  selectCountry(code: string) {
    const countryName = this.getCountryName(code);
    this.signUpForm.get('originCountry')?.setValue(countryName);
    this.showCountryDropdown = false;
  }

  // Get country name by code
  getCountryName(code: string): string {
    return this.countries.find(c => c.code === code)?.name || 'Not specified';
  }

  // Get language names from codes
  getLanguageNames(codes: string[]): string {
    if (!codes || codes.length === 0) return 'Not specified';
    return codes.map(code => 
      this.languages.find(l => l.code === code)?.name || code
    ).join(', ');
  }

  // Toggle language selection
  toggleLanguage(language: string) {
    const current = this.signUpForm.get('spokenLanguages')?.value || [];
    const newValue = current.includes(language) 
      ? current.filter(l => l !== language)
      : [...current, language];
    
    this.signUpForm.get('spokenLanguages')?.setValue(newValue);
  }

  // Check if language is selected
  isLanguageSelected(language: string): boolean {
    return (this.signUpForm.get('spokenLanguages')?.value || []).includes(language);
  }

  // Handle image upload

  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);
  
    if (!file.type.match('image.*')) {
      this.errorMessage = 'Only image files are allowed';
      return;
    }
  
    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'Image size should be less than 2MB';
      return;
    }
  
    // ✅ Store just the file name
    this.imageFileName = file.name;
  
    // Optionally store it in the form too
    // this.signUpForm.patchValue({ image: this.imageFileName });

    fetch('http://localhost:9090/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.imageFileName = data.fileName;
      this.signUpForm.patchValue({ image: this.imageFileName });
    })
    .catch(err => {
      this.errorMessage = 'Image upload failed. Please try again.';
    });
    
    
  
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
      this.errorMessage = '';
    };
    reader.readAsDataURL(file);
  }
  
  register() {
    if (this.signUpForm.invalid || !this.acceptTerms) {
      this.signUpForm.markAllAsTouched();
      this.errorMessage = this.getErrorMessage();
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    // In register() method
    const formData = {
      firstName: this.signUpForm.value.firstName,
      lastName: this.signUpForm.value.lastName,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
      originCountry: this.signUpForm.value.originCountry, // This should already be the country name
      spokenLanguage: this.getLanguageNames(this.signUpForm.value.spokenLanguages || []),
      interests: this.signUpForm.value.interests,
      role: 'USER',
      image: this.imageFileName || 'default-avatar.png'
    };
  
    this.authService.register(formData)
      .pipe(
        catchError(error => {
          console.error('Registration error:', error);
          // Check if error has a message property
          if (error?.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            // Even if it succeeds in backend but fails in response handling
            if (error.status === 0) {
              this.errorMessage = 'Registration might have succeeded but we couldn\'t verify. Please try logging in.';
            } else {
              this.errorMessage = 'Registration failed. Please try again.';
            }
          }
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        if (response) {
          this.successMessage = 'Registration successful! Redirecting to sign in...';
          setTimeout(() => {
            this.router.navigate(['/auth/signin']);
          }, 2000);
        } else {
          // Check if we have data in database despite the error
          if (!this.errorMessage) {
            this.errorMessage = 'Registration might have succeeded. Please try logging in.';
          }
        }
      });
  }

  private getErrorMessage(): string {
    if (!this.signUpForm.get('firstName')?.valid) return 'Please enter a valid first name';
    if (!this.signUpForm.get('lastName')?.valid) return 'Please enter a valid last name';
    if (!this.signUpForm.get('email')?.valid) return 'Please enter a valid email address';
    if (!this.signUpForm.get('password')?.valid) return 'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, and one number';
    if (!this.signUpForm.get('originCountry')?.valid) return 'Please select your country';
    if (!this.signUpForm.get('spokenLanguages')?.valid) return 'Please select at least one language';
    if (!this.signUpForm.get('interests')?.valid) return 'Please enter your interests';
    if (!this.acceptTerms) return 'You must accept the terms and conditions';
    return 'Please fill all required fields';
  }
}