import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { currency } from '@common/constants';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common';
import { Site } from '@core/Models/site';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '@core/services/site.service';
import { CategoryService } from '@core/services/category.service';
import { ReviewService } from '@core/services/review.service';
import { Wishlist } from '@core/Models/wishlist';
import { WishlistService } from '@core/services/wishlist.service';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heritage-site-info',
  standalone: true,
  imports: [NgbRatingModule, NgbTooltipModule, CommonModule, ReactiveFormsModule],
  templateUrl: './site-info.component.html',
  styles: [`
    .filled {
      position: absolute;
      left: 0;
      overflow: hidden;
    }
    .heart-red {
      color: #ff4136;
    }
  `]
})
export class HeritageSiteInfoComponent implements OnChanges, OnInit {
  currency=currency
  @Input() site!: Site;
  rating: number = 0;
  hasRating: boolean = false;

  currentUser: User | null = null;
  wishlistItems: number[] = []; // Array of site IDs in the wishlist
  
  // Review modal
  reviewForm!: FormGroup;
  private reviewModal: any;

  categoriesMap = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeReviewForm();
    
    // Get current user and load wishlist if logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserWishlist(user.id);
      }
    });
    
    // Load categories
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.site && this.site.id) {
      this.updateRating();
    }
  }
  
  /**
   * Initialize the review form
   */
  initializeReviewForm(): void {
    this.reviewForm = this.formBuilder.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }
  
  /**
   * Load user's wishlist
   */
  loadUserWishlist(userId: number): void {
    this.wishlistService.getWishlist(userId).subscribe({
      next: (wishlistItems: Wishlist[]) => {
        // Extract site IDs from wishlist items
        this.wishlistItems = wishlistItems.map(item => item.heritageSite.id);
      },
      error: (error: any) => {
        console.error('Error loading wishlist:', error);
      }
    });
  }
  
  /**
   * Check if a site is in the user's wishlist
   */
  isInWishlist(siteId: number): boolean {
    return this.wishlistItems.includes(siteId);
  }
  
  /**
   * Toggle a site in the wishlist
   */
  toggleWishlist(siteId: number): void {
    if (!this.currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to save sites to your wishlist',
        icon: 'warning'
      });
      return;
    }

    const isInWishlist = this.isInWishlist(siteId);
    
    if (isInWishlist) {
      // Find the wishlist entry to remove
      this.wishlistService.getWishlist(this.currentUser.id).subscribe({
        next: (wishlistItems: Wishlist[]) => {
          const wishlistItem = wishlistItems.find(item => item.heritageSite?.id === siteId);
          if (wishlistItem && wishlistItem.id) {
            this.wishlistService.removeWishlist(wishlistItem.id).subscribe({
              next: (response: any) => {
                console.log('Removed from wishlist:', response);
                // Remove from local array
                this.wishlistItems = this.wishlistItems.filter(id => id !== siteId);
                
                Swal.fire({
                  title: 'Removed!',
                  text: 'Site has been removed from your wishlist.',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false
                });
              },
              error: (error: any) => {
                console.error('Error removing from wishlist:', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to remove from wishlist',
                  icon: 'error'
                });
              }
            });
          } else {
            console.error('Wishlist item not found for site:', siteId);
          }
        },
        error: (error: any) => {
          console.error('Error fetching wishlist to remove item:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to access your wishlist',
            icon: 'error'
          });
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(this.currentUser.id, siteId).subscribe({
        next: () => {
          // Add to local array if not already there
          if (!this.wishlistItems.includes(siteId)) {
            this.wishlistItems.push(siteId);
          }
          
          Swal.fire({
            title: 'Added!',
            text: 'Site has been added to your wishlist.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error: any) => {
          console.error('Error adding to wishlist:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to add to wishlist',
            icon: 'error'
          });
        }
      });
    }
  }
  
  /**
   * Open review modal
   */
  openAddReviewModal(site: Site): void {
    if (!this.currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to leave a review',
        icon: 'warning'
      });
      return;
    }
    
    if (!site) {
      Swal.fire({
        title: 'Error',
        text: 'Heritage site information is missing',
        icon: 'error'
      });
      return;
    }
    
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
   * Submit a review
   */
  submitReview(): void {
    if (!this.reviewForm.valid || !this.site || !this.currentUser) {
      return;
    }
    
    const review = {
      id: 0, // Will be assigned by the backend
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.content,
      createdAt: new Date().toISOString(),
      flagged: false,
      user: { id: this.currentUser.id } as User,
      heritageSite: this.site,
      selected: false,
      expanded: false
    };
    
    this.reviewService.addReview(review).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success',
          text: 'Your review has been submitted',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
        
        // Update the site's average rating locally
        // Simple average calculation (this is just an estimate until we fetch fresh data)
        const currentRating = this.site.averageRating || 0;
        const newRating = (currentRating + this.reviewForm.value.rating) / 2;
        this.site.averageRating = newRating;
        this.rating = newRating;
        this.hasRating = true;
        
        if (this.reviewModal) {
          this.reviewModal.hide();
        }
      },
      error: (error: any) => {
        console.error('Error submitting review:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to submit review',
          icon: 'error'
        });
      }
    });
  }
  
  updateRating(): void {
    if (this.site?.averageRating) {
      this.rating = this.site.averageRating;
      this.hasRating = this.rating > 0;
    } else {
      // Use the ReviewService's calculateAverageRating function
      this.reviewService.calculateAverageRating(this.site.id).subscribe({
        next: (result) => {
          this.rating = result.average;
          this.hasRating = result.hasReviews;
          console.log(`Ratings for site ${this.site.id}:`, result);
        },
        error: (err) => {
          console.error(`Failed to get ratings for site ${this.site.id}:`, err);
        }
      });
    }
  }

  /**
   * Load categories 
   */
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        categories.forEach(cat => this.categoriesMap.set(cat.id, cat.name));
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || 'Unknown';
  }

  /**
   * Get CSS class for the popularity badge
   */
  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'badge bg-primary';
      case 'Medium':
        return 'badge bg-warning';
      case 'Low':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  /**
   * Get icon for the popularity badge
   */
  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-trending-flat';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }
}