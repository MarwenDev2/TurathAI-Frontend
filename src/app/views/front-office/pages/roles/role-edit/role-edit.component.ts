import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Site } from '@core/Models/site';
import { User } from '@core/Models/user';
import { Review } from '@core/Models/review';
import { ReviewService } from '@core/services/review.service';

// Define a specific type for newReview
interface NewReview {
  rating: number;
  comment: string;
  id?: number;
  createdAt?: string;
  flagged?: boolean;
  user?: User;
  heritageSite?: Site;
}

@Component({
  selector: 'app-role-edit',
  standalone: true,
  imports: [NgbRatingModule, FormsModule, CommonModule],
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss'],
})
export class RoleEditComponent implements OnInit {
  @Input() heritageSiteId: number | null = null;
  reviews: Review[] = [];
  userReview: Review | null = null;
  otherReviews: Review[] = [];
  isLoading = false;
  errorMessage = '';

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 5; // Number of reviews per page
  totalPages: number = 1;

  // Average rating and review count
  averageRating: number = 0;
  totalReviews: number = 0;

  // Filter by rating
  selectedRating: number | null = null;

  private mockHeritageSiteId = 1;
  private mockUser: User = {
    id: 1,
    firstName: 'Test User',
    lastName: 'test',
    role: 'ADMIN',
    email: 'test@gmail.com',
    originCountry: "Tunisia",
    spokenLanguage: 'Arabic',
    interests: 'test',
    createdAt: new Date(),
    image: '1323165.png',
    password: ''
  };

  showReviewModal = false;
  newReview: NewReview = { rating: 0, comment: '' };
  editingReview: Review | null = null;

  constructor(
    private reviewService: ReviewService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  get isUserOrAdmin(): boolean {
    return this.mockUser.role === 'USER' || this.mockUser.role === 'ADMIN';
  }

  get isAdmin(): boolean {
    return this.mockUser.role === 'ADMIN';
  }

  get canAddReview(): boolean {
    return this.isUserOrAdmin && !this.userReview;
  }

  loadReviews(): void {
    const siteId = this.heritageSiteId ?? this.mockHeritageSiteId;
    if (!siteId) {
      this.errorMessage = 'No heritage site ID provided.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.reviewService.getReviewsByHeritageSite(siteId).subscribe({
      next: (reviews) => {
        console.log('Fetched reviews:', reviews);
        const userReviewIndex = reviews.findIndex(review => review.user?.id === this.mockUser.id);
        if (userReviewIndex !== -1) {
          this.userReview = reviews[userReviewIndex];
          this.otherReviews = reviews.filter(review => review.user?.id !== this.mockUser.id);
        } else {
          this.userReview = null;
          this.otherReviews = reviews;
        }

        // Sort otherReviews by rating (descending)
        this.otherReviews.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));

        // Debug: Log otherReviews with ratings
        console.log('otherReviews after sorting:', this.otherReviews.map(review => ({
          id: review.id,
          rating: review.rating,
          ratingType: typeof review.rating,
          convertedRating: Number(review.rating)
        })));

        // Calculate total reviews and average rating
        this.totalReviews = this.otherReviews.length + (this.userReview ? 1 : 0);
        const totalRating = reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0);
        this.averageRating = this.totalReviews > 0 ? totalRating / this.totalReviews : 0;

        this.updatePagination();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load reviews for this heritage site.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // Update pagination based on filtered reviews
  updatePagination(): void {
    const filteredReviews = this.selectedRating !== null
      ? this.otherReviews.filter(review => Math.floor(Number(review.rating || 0)) === Number(this.selectedRating))
      : this.otherReviews;
    this.totalPages = Math.ceil(filteredReviews.length / this.pageSize);
    this.currentPage = 1; // Reset to first page when filter changes

    // Debug: Log filtered reviews
    console.log('Selected rating:', this.selectedRating, 'Type:', typeof this.selectedRating);
    console.log('Filtered reviews:', filteredReviews.map(review => ({
      id: review.id,
      rating: review.rating,
      convertedRating: Number(review.rating)
    })));
  }

  // Get the reviews for the current page, applying the rating filter
  get paginatedReviews(): Review[] {
    const filteredReviews = this.selectedRating !== null
      ? this.otherReviews.filter(review => Math.floor(Number(review.rating || 0)) === Number(this.selectedRating))
      : this.otherReviews;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filteredReviews.slice(startIndex, startIndex + this.pageSize);
  }

  // Pagination navigation
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Generate array of page numbers
  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Filter reviews by rating
  filterByRating(rating: number | null): void {
    this.selectedRating = rating;
    this.updatePagination();
  }

  // Reset filter
  resetFilter(): void {
    this.selectedRating = null;
    this.updatePagination();
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

  submitReview(): void {
    const siteId = this.heritageSiteId ?? this.mockHeritageSiteId;
    if (!siteId) return;

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
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to update review.';
          console.error(err);
        },
      });
    } else {
      // Add new review
      this.reviewService.addReview(reviewData).subscribe({
        next: () => {
          this.loadReviews();
          this.closeReviewModal();
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to add review.';
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
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete review.';
          console.error(err);
        },
      });
    }
  }
}