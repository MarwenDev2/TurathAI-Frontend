import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';
import { 
  trigger,
  state,
  style,
  animate,
  transition,
  stagger,
  query,
  keyframes
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as bootstrap from 'bootstrap';
import { AboutComponent } from './components/about/about.component';
import { AchievementComponent } from './components/achivement/achivement.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { UserService } from '@core/services/user.service';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    PersonalInfoComponent,
    AboutComponent,
    AchievementComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  animations: [
    // Button hover animation
    trigger('buttonHover', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('hover', style({
        transform: 'scale(1.05)'
      })),
      transition('normal <=> hover', [
        animate('0.2s ease')
      ])
    ]),

    // Slide in animation
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.4s ease-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', 
          style({ opacity: 0, transform: 'translateX(20px)' }))
      ])
    ]),

    // Slide in from right
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('0.4s 0.2s ease-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),

    // Fade in animation
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', 
          style({ opacity: 1 }))
      ])
    ]),

    // Fade in up animation
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s 0.2s ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Stagger animation for stats
    trigger('staggerAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('0.5s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(20px)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1 })
          ]))
        ]), { optional: true })
      ])
    ]),

    // Card hover animation
    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)'
      })),
      state('hover', style({
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      })),
      transition('normal <=> hover', [
        animate('0.3s ease')
      ])
    ]),

    // Tag animation
    trigger('tagAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.3s cubic-bezier(.8,-0.6,0.2,1.5)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  currentUser: User | null = null;
  isLoading = true;
  interestsList: string[] = [];
  newInterest = '';
  isUpdating = false;
  
  // Profile form
  profileForm!: FormGroup;
  isSavingProfile = false;
  selectedFile: File | null = null;
  uploadErrorMessage = '';
  imageFileName: string | null = null;

  // Stats data
  userStats = [
    { icon: 'solar:map-point-bold-duotone', label: 'Country', value: 'Unknown' },
    { icon: 'solar:global-bold-duotone', label: 'Language', value: 'Unknown' },
    { icon: 'solar:calendar-bold-duotone', label: 'Member Since', value: 'Not available' },
    { icon: 'solar:user-id-bold-duotone', label: 'Account Type', value: 'Member' }
  ];

  constructor(private authService: AuthService, 
              private userService: UserService,
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {}

  ngOnInit(): void {
    this.initializeProfileForm();
    
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoading = false;
        
        if (user) {
          // Update stats with user data
          this.userStats = [
            { icon: 'solar:map-point-bold-duotone', label: 'Country', value: user.originCountry || 'Unknown' },
            { icon: 'solar:global-bold-duotone', label: 'Language', value: user.spokenLanguage || 'Unknown' },
            { icon: 'solar:calendar-bold-duotone', label: 'Member Since', value: this.getMemberSince() },
            { icon: 'solar:user-id-bold-duotone', label: 'Account Type', value: user.role || 'Member' }
          ];
          
          if (user.interests) {
            this.interestsList = user.interests.split(',').map(i => i.trim());
          }
          
          // Update form with user data
          if (user) {
          this.updateProfileForm(user);
        }
        }
      },
      error: (err) => {
        console.error('Error loading user data', err);
        this.isLoading = false;
      }
    });
  }

  getProfileImage(): string {
    if (!this.currentUser?.image) return 'assets/images/default-avatar.png';
    return `http://localhost:9090/assets/images/users/${this.currentUser.image}`;
  }

  getMemberSince(): string {
    if (!this.currentUser?.createdAt) return 'Not available';
    const date = new Date(this.currentUser.createdAt);
    return date.toLocaleDateString();
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
  
  openProfileModal(): void {
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
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
        
        // Force reload of user data with slight delay to ensure server updates are complete
        setTimeout(() => {
          this.loadUserData();
        }, 300);
      },
      error: (error: any) => {
        console.error('Error updating user with new image:', error);
      }
    });
  }

  loadUserData(): void {
    // Try to get user from AuthService observable first
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.updateUserData(user);
        if (user) {
          this.updateProfileForm(user);
        }
      },
      error: (err) => {
        console.error('Error loading user from AuthService:', err);
        // Fallback to stored user if available
        const storedUser = this.authService.getStoredUser();
        if (storedUser) {
          this.updateUserData(storedUser);
        } else {
          this.isLoading = false;
          this.toastr.error('Failed to load user data');
        }
      }
    });
  }
  
  private updateUserData(user: User | null): void {
    this.currentUser = user;
    this.isLoading = false;
    
    if (user) {
      this.interestsList = user.interests?.split(',').map(i => i.trim()) || [];
    }
  }

  addInterest(): void {
    if (!this.newInterest.trim()) {
      this.toastr.warning('Please enter an interest');
      return;
    }

    const trimmedInterest = this.newInterest.trim();
    
    if (this.interestsList.includes(trimmedInterest)) {
      this.toastr.warning('This interest already exists');
      this.newInterest = '';
      return;
    }

    if (!this.currentUser?.id) {
      this.toastr.error('User not properly loaded');
      return;
    }

    this.isUpdating = true;
    
    // Create new interests array
    const updatedInterests = [...this.interestsList, trimmedInterest];
    
    this.userService.updateUserInterests(
      this.currentUser.id,
      this.currentUser,
      updatedInterests
    ).subscribe({
      next: (updatedUser) => {
        this.handleUpdateSuccess(updatedUser, 'Interest added successfully');
      },
      error: (err) => {
        this.handleUpdateError(err, 'add interest');
      }
    });
  }

  removeInterest(interest: string): void {
    if (!this.currentUser?.id) {
      this.toastr.error('User not loaded');
      return;
    }

    this.isUpdating = true;
    
    const updatedInterests = this.interestsList.filter(i => i !== interest);
    
    this.userService.updateUserInterests(
      this.currentUser.id,
      this.currentUser,
      updatedInterests
    ).subscribe({
      next: (updatedUser) => {
        this.handleUpdateSuccess(updatedUser, 'Interest removed successfully');
      },
      error: (err) => {
        this.handleUpdateError(err, 'remove interest');
      }
    });
  }

  private handleUpdateSuccess(updatedUser: User, successMessage: string): void {
    this.currentUser = updatedUser;
    this.interestsList = updatedUser.interests?.split(',').map(i => i.trim()) || [];
    this.newInterest = '';
    this.isUpdating = false;
    this.toastr.success(successMessage);
    
    // Update the auth service with the new user data
    this.authService.updateCurrentUser(updatedUser);
  }

  private handleUpdateError(err: any, action: string): void {
    console.error(`Error trying to ${action}:`, err);
    this.isUpdating = false;
    this.toastr.error(err.message || `Failed to ${action}`);
    
    // Reload user data to ensure consistency
    this.loadUserData();
  }
  
}