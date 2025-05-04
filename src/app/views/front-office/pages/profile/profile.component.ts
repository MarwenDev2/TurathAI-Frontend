import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@core/Models/user';
import { UserPreferences } from '@core/Models/user-preferences';
import { UserPreferencesService } from '@core/services/user-preferences.service';
import { WishlistService } from '@core/services/wishlist.service';
import { ItineraryService, Itinerary } from '../../services/itinerary.service';
import { Wishlist } from '@core/Models/wishlist';
import { StopService } from '@core/services/stop.service';
import { Stop } from '@core/Models/stop';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as bootstrap from 'bootstrap';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition 
} from '@angular/animations';
import Swal from 'sweetalert2';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/Models/review';
import { Site } from '@core/Models/site';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule
],
animations: [  // <-- Add this animations array
  trigger('cardHover', [
    state('normal', style({
      transform: 'translateY(0)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    })),
    state('hovered', style({
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.15)'
    })),
    transition('normal <=> hovered', animate('200ms ease-in-out'))
  ])
]
})
export class ProfileComponent implements OnInit {
[x: string]: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  currentUser: User | null = null;
  isLoading = true;
  activeTab = 'info'; // Default tab
  hoverStates: { [key: number]: boolean } = {};
  // Profile form
  profileForm!: FormGroup;
  isSavingProfile = false;
  selectedFile: File | null = null;
  uploadErrorMessage = '';
  imageFileName: string | null = null;

  // Interests management
  interestsList: string[] = [];
  newInterest = '';
  isUpdating = false;

  // Stats
  profileStats = [
    { icon: 'bx bx-map', label: 'Country', value: 'Unknown' },
    { icon: 'bx bx-globe', label: 'Languages', value: 'Unknown' },
    { icon: 'bx bx-calendar', label: 'Joined', value: 'Unknown' },
    { icon: 'bx bx-bookmark', label: 'Interests', value: '0' }
  ];

  // Trips and itineraries
  savedItineraries: any[] = [];  // Wishlist items
  wishlistItems: Wishlist[] = [];
  itineraryStops: { [itineraryId: number]: Stop[] } = {}; // Store stops for each itinerary
  loadingItineraries = false;
  loadingTrips = false;
  selectedItinerary: any = null;
  selectedItineraryStops: Stop[] = [];
  private bookingModal: any;
  private detailsModal: any;

  pastItineraries: Itinerary[] = [];
currentItineraries: Itinerary[] = [];
upcomingItineraries: Itinerary[] = [];

  // User preferences
  userPreferences: UserPreferences | null = null;
  preferencesForm!: FormGroup;
  isLoadingPreferences = false;
  isSavingPreferences = false;
  private preferencesModal: any;

  // Review
  selectedReviewSite: Site | null = null;
  reviewForm!: FormGroup;
  private reviewModal: any;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private preferencesService: UserPreferencesService,
    private wishlistService: WishlistService,
    private itineraryService: ItineraryService,
    private stopService: StopService,
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.initializeProfileForm();
    this.initializePreferencesForm();
    this.initializeReviewForm();
    this.loadUserData();
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
  
  initializePreferencesForm(): void {
    this.preferencesForm = this.formBuilder.group({
      budgetRange: ['', Validators.required],
      preferenceCategories: ['', Validators.required],
      travelStyles: ['', Validators.required],
      languagePreferences: ['', Validators.required]
    });
  }
  
  initializeReviewForm(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
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
          // Load preferences
          this.loadUserPreferences();
          // Load wishlist and trips
          this.loadWishlistItems();
          this.loadUserTrips();
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
  
  /**
   * Load wishlist items for the current user
   */
  loadWishlistItems(): void {
    if (!this.currentUser?.id) return;
    
    this.loadingItineraries = true;
    this.wishlistService.getWishlist(this.currentUser.id).subscribe({
      next: (items) => {
        console.log('Loaded wishlist items:', items);
        this.wishlistItems = items;
        
        // Map to display format
        this.savedItineraries = items
          .filter(item => item.heritageSite)
          .map(item => ({
            id: item.id,
            heritageSiteId: item.heritageSite?.id,
            title: item.heritageSite?.name || 'Unknown Site',
            locations: this.formatLocation(item.heritageSite?.location || ''),
            description: item.heritageSite?.description?.substring(0, 100) + '...' || '',
            imageUrl: this.getHeritageSiteImage(item.heritageSite?.imageIds),
            createdAt: item.createdAt
          }));
        
        this.loadingItineraries = false;
      },
      error: (error) => {
        console.error('Error loading wishlist items:', error);
        this.toastr.error('Failed to load your saved itineraries');
        this.loadingItineraries = false;
      }
    });
  }
  
  /**
   * Load user preferences
   */
  loadUserPreferences(): void {
    if (!this.currentUser) return;
    
    this.isLoadingPreferences = true;
    this.preferencesService.getUserPreferencesByUserId(this.currentUser.id)
      .subscribe({
        next: (preferences) => {
          this.userPreferences = preferences;
          this.updatePreferencesForm();
          this.isLoadingPreferences = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.userPreferences = null;
          } else {
            console.error('Error loading user preferences:', err);
            this.toastr.error('Failed to load travel preferences');
          }
          this.isLoadingPreferences = false;
        }
      });
  }
  
  /**
   * Update the preferences form with user preferences data
   */
  updatePreferencesForm(): void {
    if (this.userPreferences) {
      this.preferencesForm.patchValue({
        budgetRange: this.userPreferences.budgetRange || '',
        preferenceCategories: this.userPreferences.preferenceCategories || '',
        travelStyles: this.userPreferences.travelStyles || '',
        languagePreferences: this.userPreferences.languagePreferences || ''
      });
    } else {
      this.preferencesForm.reset();
    }
  }
  
  /**
   * Get list of preferences for a specific field
   */
  getPreferenceList(field: string): string[] {
    if (!this.userPreferences || !(this.userPreferences as any)[field]) {
      return [];
    }
    return (this.userPreferences as any)[field].split(',').map((i: string) => i.trim());
  }
  
  /**
   * Load user trips (booked itineraries)
   */
  loadUserTrips(): void {
    if (!this.currentUser?.id) return;
    
    this.loadingTrips = true;
    
    this.itineraryService.getItinerariesByUserId(this.currentUser.id).subscribe({
      next: (itineraries) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
        
        // Clear previous values
        this.pastItineraries = [];
        this.currentItineraries = [];
        this.upcomingItineraries = [];
        
        itineraries.forEach(itinerary => {
          // Ensure dates are properly parsed
          const startDate = new Date(itinerary.startDate);
          startDate.setHours(0, 0, 0, 0);
          
          const endDate = new Date(itinerary.endDate);
          endDate.setHours(0, 0, 0, 0);
          
          // Debug output to check dates
          console.log('Processing itinerary:', {
            id: itinerary.id,
            title: itinerary.title,
            startDate: startDate,
            endDate: endDate,
            now: now
          });
  
          // Current trips: today is between start and end dates (inclusive)
          if (now >= startDate && now <= endDate) {
            console.log('Adding to current trips:', itinerary.title);
            this.currentItineraries.push(itinerary);
          } 
          // Past trips: end date is before today
          else if (now > endDate) {
            console.log('Adding to past trips:', itinerary.title);
            this.pastItineraries.push(itinerary);
          } 
          // Upcoming trips: start date is after today
          else if (now < startDate) {
            console.log('Adding to upcoming trips:', itinerary.title);
            this.upcomingItineraries.push(itinerary);
          }
        });
        
        // Load stops for all itineraries
        this.loadAllItineraryStops([...this.pastItineraries, ...this.currentItineraries, ...this.upcomingItineraries]);
        
        // Debug output
        console.log('Past trips:', this.pastItineraries);
        console.log('Current trips:', this.currentItineraries);
        console.log('Upcoming trips:', this.upcomingItineraries);
        
        this.loadingTrips = false;
      },
      error: (error: any) => {
        console.error('Error loading user trips:', error);
        this.toastr.error('Failed to load your trips');
        this.loadingTrips = false;
      }
    });
  }
  // In your ProfileComponent class:
  getDaysUntilTrip(startDate: string | Date): number {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
writeReview(itinerary: Itinerary): void {
  if (!itinerary || !itinerary.id || !this.itineraryStops[itinerary.id]?.length) {
    this.toastr.warning('No heritage sites available to review for this trip');
    return;
  }

  // Get the first heritage site from the itinerary stops
  const firstStopWithSite = this.itineraryStops[itinerary.id].find(stop => stop.heritageSite);
  
  if (!firstStopWithSite?.heritageSite) {
    this.toastr.warning('No heritage sites available to review for this trip');
    return;
  }

  this.selectedReviewSite = firstStopWithSite.heritageSite;
  this.reviewForm.reset({
    rating: 5,
    content: ''
  });
  
  const modalElement = document.getElementById('addReviewModal');
  if (modalElement) {
    this.reviewModal = new bootstrap.Modal(modalElement);
    this.reviewModal.show();
  }
}
  /**
   * Load stops for all itineraries
   */
  loadAllItineraryStops(itineraries: Itinerary[]): void {
    const requests = itineraries.map(itinerary => {
      return this.stopService.getByItineraryId(itinerary.id).pipe(
        map(stops => ({ itineraryId: itinerary.id, stops })),
        catchError(error => {
          console.error(`Error loading stops for itinerary ${itinerary.id}:`, error);
          return of({ itineraryId: itinerary.id, stops: [] });
        })
      );
    });
    
    if (requests.length === 0) return;
    
    forkJoin(requests).subscribe({
      next: (results) => {
        results.forEach(result => {
          this.itineraryStops[result.itineraryId] = result.stops;
        });
        
        // Generate titles for itineraries without titles
        this.generateMissingTitles();
      },
      error: (error) => {
        console.error('Error loading stops for itineraries:', error);
      }
    });
  }
  
  /**
   * Generate titles for itineraries that don't have one
   */
  generateMissingTitles(): void {
    const allItineraries = [...this.upcomingItineraries, ...this.currentItineraries];
    
    allItineraries.forEach(itinerary => {
      if (!itinerary.title && this.itineraryStops[itinerary.id]?.length > 0) {
        const stops = this.itineraryStops[itinerary.id];
        
        // Get the first and last stop locations or heritage site names
        const firstStop = stops[0];
        const lastStop = stops[stops.length - 1];
        
        const firstLocation = firstStop.heritageSite?.name || 'Starting point';
        const lastLocation = lastStop.heritageSite?.name || 'Destination';
        
        // Generate a title based on the stops
        if (stops.length === 1) {
          itinerary.title = `Visit to ${firstLocation}`;
        } else {
          itinerary.title = `Journey: ${firstLocation} to ${lastLocation}`;
        }
        
        // Generate a locations string
        itinerary.locations = stops
          .map(stop => stop.heritageSite?.name || 'Unknown')
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .join(', ');
      }
    });
  }
  
  /**
   * Check if an itinerary is already booked by the current user
   */
  isItineraryBooked(itineraryId: number): boolean {
    return [...this.upcomingItineraries, ...this.currentItineraries]
      .some(itinerary => itinerary.id === itineraryId);
  }
  
  /**
   * Open itinerary details modal
   */
  openItineraryDetails(itinerary: Itinerary): void {
    this.selectedItinerary = itinerary;
    this.selectedItineraryStops = this.itineraryStops[itinerary.id] || [];
    
    // Sort stops by order
    this.selectedItineraryStops.sort((a, b) => a.order - b.order);
    
    const modalElement = document.getElementById('itineraryDetailsModal');
    if (modalElement) {
      this.detailsModal = new bootstrap.Modal(modalElement);
      this.detailsModal.show();
    }
  }
  
  /**
   * Remove an item from wishlist
   * @param wishlistId The wishlist item ID to remove
   */
  removeFromWishlist(wishlistId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this item from your wishlist?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishlistService.removeWishlist(wishlistId).subscribe({
          next: () => {
            // Remove from local array
            this.savedItineraries = this.savedItineraries.filter(item => item.id !== wishlistId);
            this.wishlistItems = this.wishlistItems.filter(item => item.id !== wishlistId);
            this.toastr.success('Item removed from wishlist');
          },
          error: (error) => {
            console.error('Error removing from wishlist:', error);
            this.toastr.error('Failed to remove item from wishlist');
          }
        });
      }
    });
  }
  
  /**
   * Open booking modal for an itinerary
   * @param itinerary The itinerary to book
   */
  openBookItineraryModal(itinerary: any): void {
    this.selectedItinerary = itinerary;
    const modalElement = document.getElementById('bookItineraryModal');
    if (modalElement) {
      this.bookingModal = new bootstrap.Modal(modalElement);
      this.bookingModal.show();
    }
  }
  
  /**
   * Book an itinerary for the current user
   */
  bookItinerary(): void {
    if (!this.currentUser?.id || !this.selectedItinerary?.id) {
      return;
    }
    
    Swal.fire({
      title: 'Booking...',
      text: 'Processing your booking',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false
    });
    
    this.itineraryService.assignItineraryToUser(this.selectedItinerary.id, this.currentUser.id).subscribe({
      next: (result: Itinerary) => {
        console.log('Booking successful:', result);
        
        // Update local arrays
        this.loadUserTrips();
        
        // Close modal
        if (this.bookingModal) {
          this.bookingModal.hide();
        }
        
        Swal.fire({
          title: 'Booked!',
          text: 'Your itinerary has been booked successfully.',
          icon: 'success'
        });
      },
      error: (error: any) => {
        console.error('Error booking itinerary:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to book itinerary. Please try again.',
          icon: 'error'
        });
      }
    });
  }
  
  /**
   * Cancel a booked itinerary
   * @param itineraryId The itinerary ID to cancel
   */
  cancelTrip(itineraryId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to cancel this trip?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itineraryService.removeItineraryFromUser(itineraryId).subscribe({
          next: () => {
            // Reload trips
            this.loadUserTrips();
            this.toastr.success('Trip canceled successfully');
          },
          error: (error) => {
            console.error('Error canceling trip:', error);
            this.toastr.error('Failed to cancel trip');
          }
        });
      }
    });
  }
  
  /**
   * Format a location string
   * @param location The location string to format
   * @returns Formatted location string
   */
  formatLocation(location: string): string {
    if (!location) return 'Unknown location';
    
    // Simple coordinates check
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(location)) {
      return 'Tunisia'; // Simplified for this example
    }
    
    return location;
  }
  
  /**
   * Get image URL for a heritage site
   * @param imageIds Array of image IDs
   * @returns URL to the first image or default image
   */
  getHeritageSiteImage(imageIds?: number[]): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.jpg';
    }
    return `http://localhost:8080/images/${imageIds[0]}`;
  }
  
  /**
   * Format a date string
   */
  getFormattedDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  getProfileImage(): string {
    if (!this.currentUser?.image) return 'assets/images/default-avatar.png';
    return `http://localhost:8080/assets/images/users/${this.currentUser.image}`;
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  openProfileModal(): void {
    const modalElement = document.getElementById('editProfileModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
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
    
    fetch('http://localhost:8080/api/upload', {
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
      error: (error) => {
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
  
  /**
   * Open preferences modal
   */
  openPreferencesModal(): void {
    const modalElement = document.getElementById('editPreferencesModal');
    if (modalElement) {
      this.preferencesModal = new bootstrap.Modal(modalElement);
      this.preferencesModal.show();
    }
  }
  
  /**
   * Split comma separated string into array
   */
  splitCommaSeparated(value: string): string[] {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);
  }
  
  /**
   * Save user preferences
   */
  savePreferences(): void {
    if (this.preferencesForm.invalid || !this.currentUser) return;

    this.isSavingPreferences = true;

    const preferencesData = {
      budgetRange: this.preferencesForm.value.budgetRange,
      preferenceCategories: this.splitCommaSeparated(this.preferencesForm.value.preferenceCategories).join(','),
      travelStyles: this.splitCommaSeparated(this.preferencesForm.value.travelStyles).join(','),
      languagePreferences: this.splitCommaSeparated(this.preferencesForm.value.languagePreferences).join(','),
      userId: this.currentUser.id
    };

    const request$ = this.userPreferences && this.userPreferences.id
      ? this.preferencesService.updateUserPreferences(this.userPreferences.id, preferencesData)
      : this.preferencesService.createUserPreferences(preferencesData);

    request$.subscribe({
      next: (savedPrefs) => {
        this.userPreferences = savedPrefs;
        this.toastr.success(this.userPreferences ? 'Preferences updated successfully' : 'Preferences created successfully');
        if (this.preferencesModal) {
          this.preferencesModal.hide();
        }
        this.isSavingPreferences = false;
      },
      error: (err) => {
        console.error('Error saving preferences:', err);
        this.toastr.error('Failed to save preferences');
        this.isSavingPreferences = false;
      }
    });
  }
  
  /**
   * Get CSS class for budget range
   */
  getBudgetRangeClass(): string {
    if (!this.userPreferences?.budgetRange) return '';
    switch (this.userPreferences.budgetRange.toLowerCase()) {
      case 'low': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'high': return 'text-success';
      default: return '';
    }
  }
  
  /**
   * Get text for preferences button
   */
  getPreferencesButtonText(): string {
    return this.userPreferences ? 'Edit Travel Preferences' : 'Set Travel Preferences';
  }
  
  // Logout handler
  logout(): void {
    this.authService.logout();
    this.toastr.success('You have been logged out successfully');
  }
  
  // Interest management methods
  addInterest(): void {
    if (!this.newInterest.trim() || this.isUpdating || !this.currentUser) {
      return;
    }
    
    this.isUpdating = true;
    
    // Add to local array first for UI responsiveness
    const trimmedInterest = this.newInterest.trim();
    if (!this.interestsList.includes(trimmedInterest)) {
      this.interestsList.push(trimmedInterest);
      
      // Update user with new interests
      const updatedUser = {
        ...this.currentUser,
        interests: this.interestsList.join(',')
      };
      
      this.userService.updateUser(this.currentUser.id, updatedUser).subscribe({
        next: (user: User) => {
          this.currentUser = user;
          this.authService.updateCurrentUser(user);
          this.toastr.success(`"${trimmedInterest}" added to your interests`);
          this.newInterest = ''; // Clear input
          
          // Update stats
          if (this.profileStats.length >= 4) {
            this.profileStats[3].value = this.interestsList.length.toString();
          }
        },
        error: (error) => {
          // Revert the local add if API fails
          this.interestsList = this.interestsList.filter(i => i !== trimmedInterest);
          console.error('Error adding interest:', error);
          this.toastr.error('Failed to add interest. Please try again.');
        },
        complete: () => {
          this.isUpdating = false;
        }
      });
    } else {
      this.toastr.info(`"${trimmedInterest}" is already in your interests`);
      this.newInterest = ''; // Clear input
      this.isUpdating = false;
    }
  }
  
  removeInterest(interest: string): void {
    if (this.isUpdating || !this.currentUser) {
      return;
    }
    
    this.isUpdating = true;
    
    // Remove from local array first for UI responsiveness
    this.interestsList = this.interestsList.filter(i => i !== interest);
    
    // Update user with new interests
    const updatedUser = {
      ...this.currentUser,
      interests: this.interestsList.join(',')
    };
    
    this.userService.updateUser(this.currentUser.id, updatedUser).subscribe({
      next: (user: User) => {
        this.currentUser = user;
        this.authService.updateCurrentUser(user);
        this.toastr.success(`"${interest}" removed from your interests`);
        
        // Update stats
        if (this.profileStats.length >= 4) {
          this.profileStats[3].value = this.interestsList.length.toString();
        }
      },
      error: (error) => {
        // Revert the local removal if API fails
        this.interestsList.push(interest);
        console.error('Error removing interest:', error);
        this.toastr.error('Failed to remove interest. Please try again.');
      },
      complete: () => {
        this.isUpdating = false;
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
    
    // Update interests list
    this.interestsList = user.interests?.split(',').map(i => i.trim()).filter(i => i.length > 0) || [];
  }
  
  formatDate(date: Date | string): string {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  /**
   * Select an itinerary for booking
   */
  selectItineraryForBooking(itinerary: Itinerary): void {
    if (!itinerary || this.isItineraryBooked(itinerary.id)) {
      return;
    }
    
    this.selectedItinerary = itinerary;
    
    // Load stops for this itinerary if not already loaded
    if (!this.itineraryStops[itinerary.id]) {
      this.stopService.getByItineraryId(itinerary.id).subscribe({
        next: (stops) => {
          this.itineraryStops[itinerary.id] = stops;
          this.selectedItineraryStops = stops;
          this.openBookingModal();
        },
        error: (error) => {
          console.error('Error loading stops for itinerary:', error);
          this.openBookingModal();
        }
      });
    } else {
      this.selectedItineraryStops = this.itineraryStops[itinerary.id];
      this.openBookingModal();
    }
  }
  
  /**
   * Open booking modal
   */
  openBookingModal(): void {
    const modalElement = document.getElementById('bookItineraryModal');
    if (modalElement) {
      this.bookingModal = new bootstrap.Modal(modalElement);
      this.bookingModal.show();
    }
  }

  /**
   * Open modal to add a review for a heritage site
   */
  openAddReviewModal(site: Site): void {
    if (!site) {
      this.toastr.error('Heritage site information is missing');
      return;
    }
    
    this.selectedReviewSite = site;
    this.reviewForm.reset({
      rating: 5,
      content: ''
    });
    
    const modalElement = document.getElementById('addReviewModal');
    if (modalElement) {
      this.reviewModal = new bootstrap.Modal(modalElement);
      this.reviewModal.show();
    }
  }
  
  /**
   * Submit a review for a heritage site
   */
  submitReview(): void {
    if (!this.reviewForm.valid || !this.selectedReviewSite || !this.currentUser) {
      return;
    }
    
    const review: Review = {
      id: 0, // Will be assigned by the backend
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.content,
      createdAt: new Date().toISOString(),
      flagged: false,
      user: this.currentUser,
      heritageSite: this.selectedReviewSite,
      selected: false,
      expanded: false
    };
    
    this.reviewService.addReview(review).subscribe({
      next: (response) => {
        this.toastr.success('Your review has been submitted');
        if (this.reviewModal) {
          this.reviewModal.hide();
        }
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.toastr.error('Failed to submit review');
      }
    });
  }
}
