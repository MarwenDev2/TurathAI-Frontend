import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@core/Models/user';
import * as bootstrap from 'bootstrap';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition 
} from '@angular/animations';

@Component({
  selector: 'front-office-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule
  ],
  templateUrl: './profile.component.html',
  animations: [
    // Fade in animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in', style({ opacity: 1 }))
      ])
    ]),
    // Slide up animation
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    // Card hover animation
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      })),
      state('hover', style({
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
      })),
      transition('normal <=> hover', animate('0.3s ease'))
    ])
  ]
})
export class FrontOfficeProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  currentUser: User | null = null;
  isLoading = true;
  activeTab = 'info'; // Default tab
  
  // Profile form
  profileForm!: FormGroup;
  isSavingProfile = false;
  selectedFile: File | null = null;
  uploadErrorMessage = '';
  imageFileName: string | null = null;

  // Stats
  profileStats = [
    { icon: 'bx bx-map', label: 'Country', value: 'Unknown' },
    { icon: 'bx bx-globe', label: 'Languages', value: 'Unknown' },
    { icon: 'bx bx-calendar', label: 'Joined', value: 'Unknown' },
    { icon: 'bx bx-bookmark', label: 'Interests', value: '0' }
  ];

  // Placeholder for trips/itineraries
  savedItineraries: any[] = [];
  completedTrips: any[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeProfileForm();
    this.loadUserData();
    
    // Placeholder data - would come from a service in real implementation
    this.savedItineraries = [
      { id: 1, title: 'Weekend in Tunis', locations: 'Tunis, Sidi Bou Said', days: 2, imageUrl: 'assets/images/itineraries/tunis.jpg' },
      { id: 2, title: 'Southern Desert Tour', locations: 'Tozeur, Douz, Matmata', days: 5, imageUrl: 'assets/images/itineraries/desert.jpg' }
    ];
    
    this.completedTrips = [
      { id: 1, title: 'Historical Carthage', date: 'March 15, 2025', rating: 4.8, imageUrl: 'assets/images/trips/carthage.jpg' }
    ];
  }

  initializeProfileForm(): void {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      originCountry: [''],
      spokenLanguage: [''],
      interests: ['']
    });
  }
  
  loadUserData(): void {
    this.isLoading = true;
    
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        
        if (user) {
          // Update stats
          this.profileStats = [
            { icon: 'bx bx-map', label: 'Country', value: user.originCountry || 'Not specified' },
            { icon: 'bx bx-globe', label: 'Languages', value: user.spokenLanguage || 'Not specified' },
            { icon: 'bx bx-calendar', label: 'Joined', value: this.formatDate(user.createdAt) },
            { icon: 'bx bx-bookmark', label: 'Interests', value: user.interests ? user.interests.split(',').length.toString() : '0' }
          ];
          
          // Update form
          this.updateProfileForm(user);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.toastr.error('Could not load profile information');
        this.isLoading = false;
      }
    });
  }
  
  updateProfileForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      originCountry: user.originCountry || '',
      spokenLanguage: user.spokenLanguage || '',
      interests: user.interests || ''
    });
  }
  
  formatDate(date: Date | string): string {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  getProfileImage(): string {
    if (!this.currentUser?.image) return 'assets/images/default-avatar.png';
    return `http://localhost:9090/assets/images/users/${this.currentUser.image}`;
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  openProfileModal(): void {
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }
  
  openImageUpload(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files?.length) return;
    
    const file = input.files[0];
    if (!file.type.match('image.*')) {
      this.uploadErrorMessage = 'Only image files are allowed';
      this.toastr.error(this.uploadErrorMessage);
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      this.uploadErrorMessage = 'Image size should be less than 2MB';
      this.toastr.error(this.uploadErrorMessage);
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    // Display loading indicator
    this.toastr.info('Uploading image...', '', { timeOut: 0, extendedTimeOut: 0, closeButton: true });
    
    fetch('http://localhost:9090/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.imageFileName = data.fileName;
      this.updateUserWithNewImage();
      this.toastr.clear(); // Clear loading toast
      this.toastr.success('Profile image updated successfully');
    })
    .catch(err => {
      console.error('Error uploading image:', err);
      this.toastr.clear(); // Clear loading toast
      this.toastr.error('Image upload failed. Please try again.');
      this.uploadErrorMessage = 'Image upload failed. Please try again.';
    });
  }
  
  updateUserWithNewImage(): void {
    if (!this.imageFileName || !this.currentUser) {
      return;
    }
    
    const updatedUser = {
      ...this.currentUser,
      image: this.imageFileName
    };
    
    this.userService.updateUser(this.currentUser.id, updatedUser).subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.authService.updateCurrentUser(user);
        // Force reload to update image
        this.loadUserData();
      },
      error: (error: any) => {
        console.error('Error updating user with new image:', error);
      }
    });
  }
  
  saveProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }
    
    this.isSavingProfile = true;
    
    const userData: User = {
      ...this.currentUser,
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      originCountry: this.profileForm.value.originCountry,
      spokenLanguage: this.profileForm.value.spokenLanguage,
      interests: this.profileForm.value.interests
    };
    
    this.userService.updateUser(this.currentUser.id, userData).subscribe({
      next: (updatedUser: User) => {
        this.toastr.success('Profile updated successfully');
        this.currentUser = updatedUser;
        this.authService.updateCurrentUser(updatedUser);
        
        // Close modal
        const modalElement = document.getElementById('editProfileModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          modalInstance?.hide();
        }
        
        // Refresh user data
        this.loadUserData();
      },
      error: (error: any) => {
        console.error('Error updating profile', error);
        this.toastr.error('Failed to update profile');
        this.isSavingProfile = false;
      },
      complete: () => {
        this.isSavingProfile = false;
      }
    });
  }
  
  // Trigger hover state for animation
  onCardMouseEnter(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.classList.add('hovered');
    }
  }
  
  onCardMouseLeave(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.classList.remove('hovered');
    }
  }
  
  // Logout handler
  logout(): void {
    this.authService.logout();
    this.toastr.success('You have been logged out successfully');
  }
}
