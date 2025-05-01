import { Component, OnInit } from '@angular/core';
import { NgbPaginationModule, NgbProgressbarModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Review } from '@core/Models/review';
import { User } from '@core/Models/user';
import { ReviewService } from '@core/services/review.service';
import { UserService } from '@core/services/user.service';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'review-list',
  standalone: true,
  imports: [NgbPaginationModule, NgbProgressbarModule, NgbRatingModule, NgbTooltipModule, FormsModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {

  reviews: Review[] = [];
  heritageSites: Site[] = [];
  filteredHeritageSites: Site[] = [];
  currentUser: User | null = null;
  page = 1;
  pageSize = 5;
  totalReviews = 0;
  isLoading = false;
  errorMessage = '';
  addErrorMessage = '';
  editErrorMessage = '';
  showAddModal = false;
  showEditModal = false;
  selectedReview: Review | null = null;
  newReview: Partial<Review> = {
    rating: 0,
    comment: '',
    flagged: false,
  };
  newReviewRating: number = 0;

  addHeritageSiteSearchTerm = '';
  isDropdownOpen = false;
  addIsDropdownOpen = false;
  initialHeritageSiteName = '';
  addInitialHeritageSiteName = '';
  isSubmitting = false;
  submitProgress = 0;
  addHovered = 0;
  editHovered = 0;
  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: 'add-to-edit' | 'edit-replace' | null = null;
  deleteAction: 'single' | 'bulk' | null = null;
  reviewToDelete: number | null = null;
  existingReview: Review | null = null;

  // Filtering properties
  commentFilter: string = '';
  dateFilter: string = '';
  ratingFilter: string = '';
  filteredReviews: Review[] = [];

  // Bulk actions
  selectAll: boolean = false;

  // Insights
  userAverageRating: number = 0;
  ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  recentReviews: Review[] = [];

  showCompareModal: boolean = false;

  constructor(
    private reviewService: ReviewService,
    private userService: UserService,
    private heritageSiteService: SiteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadHeritageSites();
  }

  loadCurrentUser(): void {
    // Use the AuthService to get the current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = user;
        
        forkJoin({
          averageRating: this.reviewService.getAverageRatingByUser(user.id),
          ratingDistribution: this.reviewService.getRatingDistributionByUser(user.id),
          recentReviews: this.reviewService.getRecentReviewsByUser(user.id),
        }).subscribe({
          next: ({ averageRating, ratingDistribution, recentReviews }) => {
            this.userAverageRating = averageRating;
            this.ratingDistribution = ratingDistribution;
            this.recentReviews = recentReviews.map(review => ({ ...review, expanded: false })); // Initialize expanded
            this.loadReviews();
          },
          error: (err) => {
            this.errorMessage = 'Failed to load user insights.';
            console.error(err);
            this.loadReviews();
          },
        });
      } else {
        this.errorMessage = 'You must be logged in to view your reviews.';
      }
    });
  }

  loadHeritageSites(): void {
    this.heritageSiteService.getAll().subscribe({
      next: (sites) => {
        this.heritageSites = sites;
        this.filteredHeritageSites = sites;
      },
      error: (err) => {
        console.error('Failed to load heritage sites:', err);
      },
    });
  }

  loadReviews(): void {
    if (!this.currentUser) return;
    this.isLoading = true;
    this.reviewService.getReviewsByUserPaginated(
      this.currentUser.id,
      this.page,
      this.pageSize,
      this.commentFilter,
      this.dateFilter,
      this.ratingFilter
    ).subscribe({
      next: (response: { reviews: Review[], total: number }) => {
        this.reviews = response.reviews.map(review => ({ ...review, selected: false }));
        this.totalReviews = response.total;
        this.filteredReviews = [...this.reviews];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reviews.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  openAddModal(): void {
    if (this.currentUser?.role === 'CLIENT') {
      this.errorMessage = 'Clients cannot add reviews.';
      return;
    }
    this.newReview = { rating: 0, comment: '', flagged: false };
    this.newReviewRating = 0;
    this.addHeritageSiteSearchTerm = '';
    this.addInitialHeritageSiteName = '';
    this.addIsDropdownOpen = false;
    this.filteredHeritageSites = this.heritageSites;
    this.addErrorMessage = '';
    this.addHovered = 0;
    this.isSubmitting = false;
    this.submitProgress = 0;
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.addErrorMessage = '';
    this.isSubmitting = false;
    this.submitProgress = 0;
  }

  addReview(): void {
    this.addErrorMessage = '';

    this.newReview.rating = this.newReviewRating;

    if (!this.currentUser) {
      this.addErrorMessage = 'User not authenticated.';
      return;
    }
    if (!this.newReview.heritageSite) {
      this.addErrorMessage = 'Please select a heritage site.';
      return;
    }
    if (!this.newReview.rating || this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.addErrorMessage = 'Please provide a rating between 1 and 5.';
      return;
    }
    if (!this.newReview.comment || this.newReview.comment.trim() === '') {
      this.addErrorMessage = 'Please provide a comment.';
      return;
    }

    const existingReview = this.reviews.find(
      (review) => review.heritageSite?.id === this.newReview.heritageSite?.id
    );

    if (existingReview) {
      this.existingReview = existingReview;
      this.confirmMessage = `You already have a review for "${this.newReview.heritageSite.name}". Would you like to edit the existing review instead?`;
      this.confirmAction = 'add-to-edit';
      this.showConfirmModal = true;
      return;
    }

    this.proceedWithAddReview();
  }

  proceedWithAddReview(): void {
    this.isSubmitting = true;
    this.submitProgress = 10;
    const progressInterval = setInterval(() => {
      this.submitProgress = Math.min(this.submitProgress + 10, 90);
    }, 200);
  
    const reviewToAdd: Review = {
      id: 0,
      rating: this.newReview.rating!,
      comment: this.newReview.comment || '',
      createdAt: new Date().toISOString(),
      flagged: false,
      user: this.currentUser!,
      heritageSite: this.newReview.heritageSite!,
    };
  
    this.reviewService.addReview(reviewToAdd).subscribe({
      next: () => {
        clearInterval(progressInterval);
        this.submitProgress = 100;
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0;
          this.showAddModal = false;
          this.refreshAllReviews(); // This refreshes everything
        }, 1000);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.addErrorMessage = 'Failed to add review: ' + err.message;
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0;
        }, 1000);
      },
    });
  }

  openEditModal(review: Review): void {
    if (this.currentUser?.role === 'CLIENT') {
        this.errorMessage = 'Clients cannot edit reviews.';
        return;
    }
    console.log('Review being edited:', review);
    this.selectedReview = { ...review };
    this.addHeritageSiteSearchTerm = review.heritageSite?.name || 'Unknown Heritage Site';
    this.initialHeritageSiteName = this.addHeritageSiteSearchTerm;
    this.filteredHeritageSites = this.heritageSites;
    this.isDropdownOpen = false;
    this.editErrorMessage = '';
    this.editHovered = 0;
    this.isSubmitting = false;
    this.submitProgress = 0;
    this.showEditModal = true;
}

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedReview = null;
    this.isDropdownOpen = false;
    this.initialHeritageSiteName = '';
    this.editErrorMessage = '';
    this.isSubmitting = false;
    this.submitProgress = 0;
  }

  updateReview(): void {
    this.editErrorMessage = '';

    if (!this.selectedReview) return;

    if (!this.selectedReview.heritageSite) {
      this.editErrorMessage = 'Please select a heritage site.';
      return;
    }
    if (!this.selectedReview.rating || this.selectedReview.rating < 1 || this.selectedReview.rating > 5) {
      this.editErrorMessage = 'Please provide a rating between 1 and 5.';
      return;
    }
    if (!this.selectedReview.comment || this.selectedReview.comment.trim() === '') {
      this.editErrorMessage = 'Please provide a comment.';
      return;
    }

    const existingReview = this.reviews.find(
      (review) =>
        review.heritageSite?.id === this.selectedReview?.heritageSite?.id &&
        review.id !== this.selectedReview?.id
    );

    if (existingReview) {
      this.existingReview = existingReview;
      this.confirmMessage = `You already have a review for "${this.selectedReview.heritageSite.name}". Would you like to replace the existing review with this one, or choose another site?`;
      this.confirmAction = 'edit-replace';
      this.showConfirmModal = true;
      return;
    }

    this.proceedWithUpdateReview();
  }

  proceedWithUpdateReview(): void {
    if (!this.selectedReview) return;
  
    this.isSubmitting = true;
    this.submitProgress = 10;
    const progressInterval = setInterval(() => {
      this.submitProgress = Math.min(this.submitProgress + 10, 90);
    }, 200);
  
    this.reviewService.updateReview(this.selectedReview.id, this.selectedReview).subscribe({
      next: () => {
        clearInterval(progressInterval);
        this.submitProgress = 100;
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0;
          this.showEditModal = false;
          this.refreshAllReviews(); // This already refreshes everything
        }, 1000);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.editErrorMessage = 'Failed to update review: ' + err.message;
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0;
        }, 1000);
      },
    });
  }

  deleteReview(id: number): void {
    if (this.currentUser?.role === 'CLIENT') {
      this.errorMessage = 'Clients cannot delete reviews.';
      return;
    }
    this.reviewToDelete = id;
    this.deleteAction = 'single';
    this.confirmMessage = 'Are you sure you want to delete this review?';
    this.showConfirmModal = true;
  }

  get selectedReviews(): Review[] {
    return this.reviews.filter((review) => review.selected);
  }

  toggleSelectAll(): void {
    this.reviews.forEach((review) => (review.selected = this.selectAll));
  }

  updateSelectAll(): void {
    this.selectAll = this.reviews.every((review) => review.selected);
  }

  deleteSelectedReviews(): void {
    if (this.selectedReviews.length === 0) {
      this.errorMessage = 'Please select at least one review to delete.';
      return;
    }
    this.deleteAction = 'bulk';
    this.confirmMessage = `Are you sure you want to delete ${this.selectedReviews.length} reviews?`;
    this.showConfirmModal = true;
  }

  applyFilters(): void {
    this.page = 1;
    this.loadReviews();
  }

  resetFilters(): void {
    this.commentFilter = '';
    this.dateFilter = '';
    this.ratingFilter = '';
    this.page = 1;
    this.loadReviews();
  }

  paginatedReviews(): Review[] {
    return this.filteredReviews;
  }

  onPageChange(): void {
    this.loadReviews();
  }

  addSearchHeritageSites(): void {
    if (this.addHeritageSiteSearchTerm !== this.addInitialHeritageSiteName) {
      this.addIsDropdownOpen = true;
    }
    if (!this.addHeritageSiteSearchTerm) {
      this.filteredHeritageSites = this.heritageSites;
      return;
    }
    const searchTerm = this.addHeritageSiteSearchTerm.toLowerCase();
    this.filteredHeritageSites = this.heritageSites.filter((site) =>
      site.name.toLowerCase().includes(searchTerm)
    );
  }

  addSelectHeritageSite(site: Site): void {
    this.newReview.heritageSite = site;
    this.addHeritageSiteSearchTerm = site.name;
    this.addInitialHeritageSiteName = site.name;
    this.addIsDropdownOpen = false;
  }

  addToggleDropdown(): void {
    this.addIsDropdownOpen = !this.addIsDropdownOpen;
    if (this.addIsDropdownOpen) {
      this.filteredHeritageSites = this.heritageSites;
    }
  }

  searchHeritageSites(): void {
    if (this.addHeritageSiteSearchTerm !== this.initialHeritageSiteName) {
      this.isDropdownOpen = true;
    }
    if (!this.addHeritageSiteSearchTerm) {
      this.filteredHeritageSites = this.heritageSites;
      return;
    }
    const searchTerm = this.addHeritageSiteSearchTerm.toLowerCase();
    this.filteredHeritageSites = this.heritageSites.filter((site) =>
      site.name.toLowerCase().includes(searchTerm)
    );
  }

  selectHeritageSite(site: Site): void {
    if (this.selectedReview) {
      this.selectedReview.heritageSite = site;
      this.addHeritageSiteSearchTerm = site.name;
      this.initialHeritageSiteName = site.name;
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filteredHeritageSites = this.heritageSites;
    }
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.confirmMessage = '';
    this.confirmAction = null;
    this.deleteAction = null;
    this.reviewToDelete = null;
    this.existingReview = null;
  }

  openCompareModal(): void {
    if (this.selectedReviews.length < 2) {
      this.errorMessage = 'Please select at least two reviews to compare.';
      return;
    }
    this.showCompareModal = true;
  }
  
  closeCompareModal(): void {
    this.showCompareModal = false;
  }

  confirmModalAction(): void {
    if (this.confirmAction === 'add-to-edit' && this.existingReview) {
      this.closeAddModal();
      this.openEditModal(this.existingReview);
    } else if (this.confirmAction === 'edit-replace' && this.existingReview && this.selectedReview) {
      this.isSubmitting = true;
      this.submitProgress = 10;
      const progressInterval = setInterval(() => {
        this.submitProgress = Math.min(this.submitProgress + 10, 90);
      }, 200);
  
      this.reviewService.deleteReview(this.existingReview.id).subscribe({
        next: () => {
          this.proceedWithUpdateReview(); // This calls refreshAllReviews
        },
        error: (err) => {
          clearInterval(progressInterval);
          this.editErrorMessage = 'Failed to delete existing review: ' + err.message;
          setTimeout(() => {
            this.isSubmitting = false;
            this.submitProgress = 0;
          }, 1000);
        },
      });
    } else if (this.deleteAction === 'single' && this.reviewToDelete !== null) {
      this.reviewService.deleteReview(this.reviewToDelete).subscribe({
        next: () => {
          this.refreshAllReviews(); // This refreshes everything
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete review.';
          console.error(err);
        },
      });
    } else if (this.deleteAction === 'bulk') {
      const deleteObservables = this.selectedReviews.map((review) =>
        this.reviewService.deleteReview(review.id)
      );
      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.selectAll = false;
          this.refreshAllReviews(); // This refreshes everything
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete some reviews.';
          console.error(err);
        },
      });
    }
    this.closeConfirmModal();
  }

  refreshAllReviews(): void {
    if (!this.currentUser) return;
    forkJoin({
      reviews: this.reviewService.getReviewsByUserPaginated(
        this.currentUser.id,
        this.page,
        this.pageSize,
        this.commentFilter,
        this.dateFilter,
        this.ratingFilter
      ),
      recentReviews: this.reviewService.getRecentReviewsByUser(this.currentUser.id),
      averageRating: this.reviewService.getAverageRatingByUser(this.currentUser.id),
      ratingDistribution: this.reviewService.getRatingDistributionByUser(this.currentUser.id),
    }).subscribe({
      next: ({ reviews, recentReviews, averageRating, ratingDistribution }) => {
        this.reviews = reviews.reviews.map(review => ({ ...review, selected: false }));
        this.totalReviews = reviews.total;
        this.filteredReviews = [...this.reviews];
        this.recentReviews = recentReviews.map(review => ({ ...review, expanded: false }));
        this.userAverageRating = averageRating;
        this.ratingDistribution = ratingDistribution;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to refresh reviews and insights.';
        console.error(err);
      },
    });
  }
}