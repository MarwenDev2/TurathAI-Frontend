import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { countries } from '@views/auth/signup/countries';
import { languages } from '@views/auth/signup/language';
import { User } from '@core/Models/user';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router: Router;

  // Form initialization
  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    originCountry: ['', Validators.required],
    spokenLanguages: [[] as string[], Validators.required],
    interests: ['', [Validators.required, Validators.maxLength(200)]],
    role: ['USER', Validators.required],
    image: [null as string | null]
  });

  // UI State
  isLoading = false;
  errorMessage = '';
  successMessage = '';
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
  roles = ['USER', 'ADMIN', 'MODERATOR']; // Add other roles as needed

  constructor() {
    // Initialize spokenLanguages as empty array
    this.userForm.get('spokenLanguages')?.setValue([]);
    this.router = inject(Router);
  }

  // Country and language methods (same as signup)
  filterCountries(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.filteredCountries = this.countries.filter(country =>
      country.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  filterLanguages() {
    this.filteredLanguages = this.languages.filter(lang =>
      lang.name.toLowerCase().includes(this.languageSearchTerm.toLowerCase())
    );
  }

  public navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }
  
  selectCountry(code: string) {
    const countryName = this.getCountryName(code);
    this.userForm.get('originCountry')?.setValue(countryName);
    this.showCountryDropdown = false;
  }

  getCountryName(code: string): string {
    return this.countries.find(c => c.code === code)?.name || 'Not specified';
  }

  getLanguageNames(codes: string[]): string {
    if (!codes || codes.length === 0) return 'Not specified';
    return codes.map(code => 
      this.languages.find(l => l.code === code)?.name || code
    ).join(', ');
  }

  toggleLanguage(language: string) {
    const current = this.userForm.get('spokenLanguages')?.value || [];
    const newValue = current.includes(language) 
      ? current.filter(l => l !== language)
      : [...current, language];
    
    this.userForm.get('spokenLanguages')?.setValue(newValue);
  }

  isLanguageSelected(language: string): boolean {
    return (this.userForm.get('spokenLanguages')?.value || []).includes(language);
  }

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
  
    this.imageFileName = file.name;
  
    fetch('http://localhost:9090/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.imageFileName = data.fileName;
      this.userForm.patchValue({ image: this.imageFileName });
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
  
  createUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.errorMessage = this.getErrorMessage();
      return;
    }
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    const userData: User = {
      id: 0,
      firstName: this.userForm.value.firstName || '',
      lastName: this.userForm.value.lastName || '',
      email: this.userForm.value.email || '',
      password: this.userForm.value.password || '',
      role: this.userForm.value.role || 'USER',
      originCountry: this.userForm.value.originCountry || '',
      interests: this.userForm.value.interests || '',
      spokenLanguage: this.getLanguageNames(this.userForm.value.spokenLanguages || []),
      image: this.imageFileName || 'default-avatar.png',
      createdAt: new Date()
    };
  
    this.userService.addUser(userData).subscribe({
      next: (user) => {
        this.successMessage = 'User created successfully!';
        this.toastr.success(this.successMessage);
        this.userForm.reset();
        this.selectedImage = null;
        this.router.navigate(['/admin/users']);
      },
      error: (error) => {
        console.error('User creation error:', error);
        this.errorMessage = error.message || 'User creation failed. Please try again.';
        this.toastr.error(this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  
  private getErrorMessage(): string {
    if (!this.userForm.get('firstName')?.valid) return 'Please enter a valid first name';
    if (!this.userForm.get('lastName')?.valid) return 'Please enter a valid last name';
    if (!this.userForm.get('email')?.valid) return 'Please enter a valid email address';
    if (!this.userForm.get('password')?.valid) return 'Password must be at least 6 characters';
    if (!this.userForm.get('originCountry')?.valid) return 'Please select country';
    if (!this.userForm.get('spokenLanguages')?.valid) return 'Please select at least one language';
    if (!this.userForm.get('interests')?.valid) return 'Please enter interests';
    if (!this.userForm.get('role')?.valid) return 'Please select role';
    return 'Please fill all required fields';
  }
}