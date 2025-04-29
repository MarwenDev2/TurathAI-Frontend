import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbRatingModule, NgbPaginationModule, NgbModal, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/Models/review';
import { Site } from '@core/Models/site';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [NgbRatingModule, NgbPaginationModule, NgbToastModule, CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnChanges {
  @Input() siteId?: number;
  reviews: Review[] = [];
  loading = true;
  error: string | null = null;
  
  // Pagination properties
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  pagedReviews: Review[] = [];
  selectedRating: number | null = null;
  otherReviews: Review[] = [];
  
  // Review modal properties
  showReviewModal = false;
  editingReview: Review | null = null;
  newReview: any = { rating: 0, comment: '' };
  errorMessage: string | null = null;
  
  // User session properties
  isAdmin = false;
  canAddReview = true;
  currentUser: User | null = null;
  mockHeritageSiteId = 1; // Fallback
  totalPages = 1;
  currentPage = 1;
  showToast = false;
  toastMessage = '';
  toastType = 'success';
  
  // Mock user for demo
  mockUser: User = {
    id: 1,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: '',
    role: 'user',
    originCountry: 'Saudi Arabia',
    interests: 'Heritage sites',
    spokenLanguage: 'English, Arabic',
    createdAt: new Date(),
    image: 'assets/images/users/avatar-1.jpg'
  };
  
  // Make Math available to the template
  Math = Math;
  
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    // Check if user is admin
    this.isAdmin = true; // For demo, set true to show admin controls
    this.checkUserSession();
  }
  
  /**
   * Check if the user is logged in and has appropriate permissions
   */
  checkUserSession() {
    // Get the current user from AuthService
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      
      // Check if user is admin (role is uppercase in auth service)
      this.isAdmin = user?.role?.toUpperCase() === 'ADMIN';
      
      console.log('Current user loaded:', this.currentUser?.id, 'Is admin:', this.isAdmin);
      
      // If we have a real user, use that instead of mock user for new reviews
      if (user) {
        this.mockUser = user;
      }
    });
  }

  ngOnInit() {
    console.log('TopReviewComponent initialized with siteId:', this.siteId);
    if (this.siteId) {
      this.loadReviews();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['siteId'] && !changes['siteId'].firstChange) {
      console.log('SiteId changed:', this.siteId);
      this.loadReviews();
    }
  }

  loadReviews() {
    this.loading = true;
    this.error = null;
    this.reviews = [];
    
    if (!this.siteId) {
      console.log('ReviewsComponent: No siteId available');
      this.loading = false;
      return;
    }
    
    console.log('ReviewsComponent: Loading reviews for siteId:', this.siteId);
    
    // Add a short delay to ensure DOM is fully loaded and ready
    setTimeout(() => {
      this.reviewService.getReviewsByHeritageSite(this.siteId!).subscribe({
        next: (reviews) => {
          console.log('ReviewsComponent: Received reviews:', reviews);
          this.reviews = reviews;
          this.otherReviews = [...reviews]; // Store a copy for filtering
          this.collectionSize = reviews.length;
          this.refreshPagedReviews();
          this.loading = false;
          
          // Reset filters if any were applied before
          if (this.selectedRating !== null) {
            this.filterByRating(this.selectedRating);
          }
          
          // Log specific review properties to verify data structure
          if (reviews.length > 0) {
            console.log('ReviewsComponent: Sample review:', {
              id: reviews[0].id,
              rating: reviews[0].rating,
              comment: reviews[0].comment,
              user: reviews[0].user
            });
          } else {
            console.log('ReviewsComponent: No reviews found for this site');
          }
        },
        error: (error) => {
          console.error('ReviewsComponent: Error loading reviews:', error);
          this.error = 'Failed to load reviews. Please try again later.';
          this.loading = false;
          
          // Try to load mock data for demonstration if API fails
          if (this.siteId) {
            console.log('ReviewsComponent: Loading mock reviews for demonstration');
            this.loadMockReviews();
          }
        }
      });
    }, 500);
  }
  
  /**
   * Refreshes the paged reviews based on current page and pageSize
   */
  refreshPagedReviews() {
    this.collectionSize = this.reviews.length;
    const startItem = (this.page - 1) * this.pageSize;
    const endItem = Math.min(this.page * this.pageSize, this.reviews.length);
    this.pagedReviews = this.reviews.slice(startItem, endItem);
    console.log(`ReviewsComponent: Showing reviews ${startItem+1}-${endItem} of ${this.collectionSize}`);
  }

  /**
   * Handle page change events from the pagination control
   */
  onPageChange(page: number) {
    this.page = page;
    this.refreshPagedReviews();
    // Scroll back to top of reviews section when page changes
    const reviewsElement = document.querySelector('.reviews-section');
    if (reviewsElement) {
      reviewsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Fallback method to load mock reviews for demonstration
  private loadMockReviews() {
    // Generate 12 mock reviews to demonstrate pagination
    this.reviews = [
      {
        id: 1,
        rating: 4.5,
        comment: 'Beautiful heritage site with rich history. I was impressed by the architecture and cultural significance.',
        createdAt: new Date().toISOString(),
        flagged: false,
        user: { 
          id: 1, 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john.doe@example.com',
          password: '',
          role: 'user',
          originCountry: 'Saudi Arabia',
          interests: 'Heritage sites',
          spokenLanguage: 'English, Arabic',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-1.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 2,
        rating: 5,
        comment: 'Amazing place! The tour guides were very knowledgeable and friendly. A must-visit destination!',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        flagged: false,
        user: { 
          id: 2, 
          firstName: 'Sarah', 
          lastName: 'Smith', 
          email: 'sarah.smith@example.com',
          password: '',
          role: 'user',
          originCountry: 'Saudi Arabia',
          interests: 'History, Culture',
          spokenLanguage: 'English, French',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-2.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 3,
        rating: 4,
        comment: 'Lovely place to visit with the family. The historical artifacts were fascinating.',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        flagged: false,
        user: { 
          id: 3, 
          firstName: 'Mohammed', 
          lastName: 'Al-Farsi', 
          email: 'mohammed.alfarsi@example.com',
          password: '',
          role: 'user',
          originCountry: 'Saudi Arabia',
          interests: 'History, Heritage',
          spokenLanguage: 'Arabic, English',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-3.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 4,
        rating: 4.5,
        comment: 'Very informative tour with excellent guides. I learned so much about the history.',
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        flagged: false,
        user: { 
          id: 4, 
          firstName: 'Emily', 
          lastName: 'Johnson', 
          email: 'emily.johnson@example.com',
          password: '',
          role: 'user',
          originCountry: 'United States',
          interests: 'Travel, Culture',
          spokenLanguage: 'English',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-4.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 5,
        rating: 3.5,
        comment: 'Nice site but could use better signage and explanations in different languages.',
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        flagged: false,
        user: { 
          id: 5, 
          firstName: 'Pierre', 
          lastName: 'Dubois', 
          email: 'pierre.dubois@example.com',
          password: '',
          role: 'user',
          originCountry: 'France',
          interests: 'Architecture, History',
          spokenLanguage: 'French, English',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-5.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 6,
        rating: 5,
        comment: 'Breathtaking experience! One of the best preserved heritage sites I have seen.',
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        flagged: false,
        user: { 
          id: 6, 
          firstName: 'Fatima', 
          lastName: 'Al-Zahrani', 
          email: 'fatima.alzahrani@example.com',
          password: '',
          role: 'user',
          originCountry: 'Saudi Arabia',
          interests: 'Photography, History',
          spokenLanguage: 'Arabic, English',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-6.jpg'
        },
        heritageSite: { id: this.siteId } as any
      },
      {
        id: 7,
        rating: 4,
        comment: 'Great site but the facilities need some improvement. The historic value is incredible though.',
        createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        flagged: false,
        user: { 
          id: 7, 
          firstName: 'David', 
          lastName: 'Chen', 
          email: 'david.chen@example.com',
          password: '',
          role: 'user',
          originCountry: 'Singapore',
          interests: 'Travel, History',
          spokenLanguage: 'English, Mandarin',
          createdAt: new Date(),
          image: 'assets/images/users/avatar-7.jpg'
        },
        heritageSite: { id: this.siteId } as any
      }
    ];
    // Add more to demonstrate pagination
    this.error = null;
    this.loading = false;
    this.collectionSize = this.reviews.length;
    this.refreshPagedReviews();
    console.log('ReviewsComponent: Loaded mock reviews:', this.reviews);
  }

  getRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3) return 'Average';
    if (rating >= 2) return 'Below Average';
    return 'Poor';
  }

  openReviewModal(content: any, review: Review | null = null): void {
    this.editingReview = review;
    if (review) {
      this.newReview = { ...review };
    } else {
      this.newReview = { rating: 0, comment: '' };
    }
    this.showReviewModal = true;
    this.modalService.open(content, { centered: true });
  }

  closeReviewModal(): void {
    this.showReviewModal = false;
    this.modalService.dismissAll();
    this.newReview = { rating: 0, comment: '' };
    this.editingReview = null;
  }

  /**
   * Shows a notification toast with a message
   */
  showNotification(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 5000);
  }

  submitReview(): void {
    const siteId = this.siteId ?? this.mockHeritageSiteId;
    if (!siteId) return;

    // Validate form
    if (!this.newReview.rating) {
      this.showNotification('Please provide a rating', 'error');
      return;
    }

    if (!this.newReview.comment || this.newReview.comment.trim().length < 5) {
      this.showNotification('Please provide a comment (minimum 5 characters)', 'error');
      return;
    }

    const reviewData: Review = {
      id: this.editingReview?.id || 0,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      createdAt: this.editingReview?.createdAt || new Date().toISOString(),
      flagged: false,
      user: this.mockUser,
      heritageSite: { id: siteId } as Site,
    };

    if (this.editingReview) {
      // Update existing review
      this.reviewService.updateReview(reviewData.id || 0, reviewData).subscribe({
        next: () => {
          this.loadReviews();
          this.closeReviewModal();
          this.showNotification('Review updated successfully!');
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to update review.';
          this.showNotification('Failed to update review', 'error');
          console.error(err);
        },
      });
    } else {
      // Add new review
      this.reviewService.addReview(reviewData).subscribe({
        next: () => {
          this.loadReviews();
          this.closeReviewModal();
          this.showNotification('Review added successfully!');
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to add review.';
          this.showNotification('Failed to add review', 'error');
          console.error(err);
        },
      });
    }
  }

  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.loadReviews();
          this.showNotification('Review deleted successfully');
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete review.';
          this.showNotification('Failed to delete review', 'error');
          console.error(err);
        },
      });
    }
  }

  /**
   * Reset all applied filters
   */
  resetFilter(): void {
    this.selectedRating = null;
    this.page = 1;
    this.reviews = [...this.otherReviews]; // Restore all reviews
    this.collectionSize = this.reviews.length;
    this.refreshPagedReviews();
    this.showNotification('Filters reset', 'info');
  }

  /**
   * Filter reviews by rating
   * @param rating Rating to filter by (or null for all)
   */
  filterByRating(rating: number | null): void {
    this.selectedRating = rating;
    this.page = 1; // Reset to first page when filter changes
    
    if (rating === null) {
      this.reviews = [...this.otherReviews]; // Show all reviews
    } else {
      // Filter reviews with the selected rating
      this.reviews = this.otherReviews.filter(review => 
        Math.floor(review.rating) === rating);
    }
    
    this.collectionSize = this.reviews.length;
    this.refreshPagedReviews();
    
    console.log(`Filtered to ${this.reviews.length} reviews with rating ${rating}`);
    
    if (rating !== null) {
      this.showNotification(`Showing ${this.reviews.length} reviews with ${rating} stars`, 'info');
    }
  }

  /**
   * Called when loading mock reviews to simulate filtering
   */
  private updatePagination(): void {
    // Store a copy of all reviews for filtering
    this.otherReviews = [...this.reviews];
    
    // Apply any existing filter
    if (this.selectedRating !== null) {
      this.filterByRating(this.selectedRating);
    } else {
      // Just refresh the paged reviews
      this.refreshPagedReviews();
    }
  }
  
}
