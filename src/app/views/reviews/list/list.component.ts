import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { SiteService } from '../../../core/services/site.service';
import { NgbRatingModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { Review } from '../../../core/Models/review';
import { Site } from '../../../core/Models/site';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from '@core/Models/user';
import { AuthService } from '@core/services/auth.service';

// Extend the Review interface with a frontend-only property
interface DisplayReview extends Review {
  isExpanded?: boolean;
}

type ExportFieldKey = 'id' | 'userName' | 'originCountry' | 'heritageSite' | 'location' | 'rating' | 'comment' | 'createdAt' | 'interests';

interface ExportFields extends Record<ExportFieldKey, boolean> {}
interface ExportHeaders extends Record<ExportFieldKey, string> {}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, NgbRatingModule, RouterModule, DatePipe, FormsModule],
  providers: [DatePipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  reviews: DisplayReview[] = [];
  heritageSites: Site[] = [];
  filteredHeritageSites: Site[] = [];
  loading: boolean = false;
  averageRatings: { [siteId: number]: { average: number, hasReviews: boolean } } = {};

  // Filter properties for reviews
  selectedRating: number = 0;
  selectedHeritageSiteId: number = 0;
  userName: string = '';
  keyword: string = '';

  // Analytics pagination and search properties
  analyticsPage: number = 0;
  analyticsPageSize: number = 5;
  totalAnalyticsItems: number = 0;
  analyticsSearchQuery: string = '';
  currentUser: User | null = null;
  // Export modal properties
  showExportModal: boolean = false;
  exportAllReviews: boolean = false;
  exportFields: ExportFields = {
    id: true,
    userName: true,
    originCountry: true,
    heritageSite: true,
    location: true,
    rating: true,
    comment: true,
    createdAt: true,
    interests: true
  };

  constructor(
    private authService: AuthService,
    public reviewService: ReviewService,
    private heritageSiteService: SiteService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadHeritageSites();
    this.loadReviews();
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      
      },
      error: (err) => {
        console.error('Error loading user data', err);
      }
    });
  }
 
  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews.map(review => ({
          ...review,
          isExpanded: false
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.loading = false;
      }
    });
  }

  loadHeritageSites(): void {
    this.heritageSiteService.getAll().subscribe({
      next: (sites) => {
        this.heritageSites = sites;
        this.filteredHeritageSites = sites;
        this.totalAnalyticsItems = sites.length;
        this.loadAverageRatings();
      },
      error: (err) => console.error('Error loading heritage sites:', err)
    });
  }

  loadAverageRatings(): void {
    this.heritageSites.forEach(site => {
      this.reviewService.calculateAverageRating(site.id).subscribe({
        next: (result) => {
          this.averageRatings[site.id] = result;
        },
        error: (err) => {
          console.error(`Error loading average rating for site ${site.id}:`, err);
          this.averageRatings[site.id] = { average: 0, hasReviews: false };
        }
      });
    });
  }

  // Filter heritage sites based on search query
  filterHeritageSites(): void {
    const query = this.analyticsSearchQuery.toLowerCase().trim();
    if (query) {
      this.filteredHeritageSites = this.heritageSites.filter(site =>
        site.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredHeritageSites = this.heritageSites;
    }
    this.totalAnalyticsItems = this.filteredHeritageSites.length;
    this.analyticsPage = 0;
  }

  // Get the current page of heritage sites for analytics
  getPaginatedHeritageSites(): Site[] {
    const startIndex = this.analyticsPage * this.analyticsPageSize;
    return this.filteredHeritageSites.slice(startIndex, startIndex + this.analyticsPageSize);
  }

  // Split site name into parts for highlighting
  getHighlightedName(siteName: string): { before: string, match: string, after: string } {
    const query = this.analyticsSearchQuery.toLowerCase().trim();
    if (!query) {
      return { before: siteName, match: '', after: '' };
    }

    const index = siteName.toLowerCase().indexOf(query);
    if (index === -1) {
      return { before: siteName, match: '', after: '' };
    }

    const before = siteName.substring(0, index);
    const match = siteName.substring(index, index + query.length);
    const after = siteName.substring(index + query.length);
    return { before, match, after };
  }

  getTotalPages(): number {
    return this.totalAnalyticsItems ? Math.ceil(this.totalAnalyticsItems / this.analyticsPageSize) : 1;
  }

  // Pagination controls for analytics
  nextAnalyticsPage(): void {
    if ((this.analyticsPage + 1) * this.analyticsPageSize < this.totalAnalyticsItems) {
      this.analyticsPage++;
    }
  }

  previousAnalyticsPage(): void {
    if (this.analyticsPage > 0) {
      this.analyticsPage--;
    }
  }

  applyFilters(): void {
    this.loading = true;
    this.reviews = [];

    // If all filters are reset, load all reviews
    if (
      this.selectedHeritageSiteId === 0 &&
      this.selectedRating === 0 &&
      !this.userName.trim() &&
      !this.keyword.trim()
    ) {
      this.loadReviews();
      return;
    }

    // Call the new mixed filtering endpoint with all filter parameters
    this.reviewService.getReviewsWithFilters(
      this.selectedHeritageSiteId,
      this.selectedRating,
      this.userName,
      this.keyword
    ).subscribe({
      next: (reviews) => {
        this.reviews = reviews.map(review => ({
          ...review,
          isExpanded: false
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error applying filters:', err);
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.selectedRating = 0;
    this.selectedHeritageSiteId = 0;
    this.userName = '';
    this.keyword = '';
    this.loadReviews();
  }

  toggleComment(review: DisplayReview): void {
    review.isExpanded = !review.isExpanded;
  }

  confirmDelete(reviewId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (confirmed) {
      this.reviewService.deleteReview(reviewId).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== reviewId);
        },
        error: (err) => {
          console.error('Failed to delete review:', err);
          alert('Failed to delete review.');
        }
      });
    }
  }

  openExportModal(): void {
    this.showExportModal = true;
    // Reset export options
    this.exportAllReviews = false;
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = true;
    });
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  selectAllFields(): void {
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = true;
    });
  }

  deselectAllFields(): void {
    Object.keys(this.exportFields).forEach(key => {
      this.exportFields[key as ExportFieldKey] = false;
    });
  }

  exportToCSV(): void {
    // Validate that at least one field is selected
    const selectedFields = Object.values(this.exportFields).filter(Boolean);
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export.');
      return;
    }

    // Determine which reviews to export
    const reviewsToExport = this.exportAllReviews
      ? this.reviewService.getReviews()
      : Promise.resolve(this.reviews);

    if (this.exportAllReviews) {
      (reviewsToExport as Observable<Review[]>).subscribe({
        next: (reviews: Review[]) => this.processExport(reviews),
        error: (err: Error) => {
          console.error('Error fetching reviews for export:', err);
          alert('Failed to export reviews.');
        }
      });
    } else {
      this.processExport(this.reviews);
    }
  }

  private processExport(reviews: Review[]): void {
    if (reviews.length === 0) {
      alert('No reviews to export.');
      return;
    }

    // Define all possible headers
    const allHeaders: ExportHeaders = {
      id: 'ID',
      userName: 'User Name',
      originCountry: 'Origin Country',
      heritageSite: 'Heritage Site',
      location: 'Location',
      rating: 'Rating',
      comment: 'Comment',
      createdAt: 'Created At',
      interests: 'Interests'
    };

    // Filter headers based on selected fields
    const headers = Object.keys(this.exportFields)
      .filter(key => this.exportFields[key as ExportFieldKey])
      .map(key => allHeaders[key as ExportFieldKey]);

    // Map reviews to CSV rows based on selected fields
    const rows = reviews.map(review => {
      const row: string[] = [];
      if (this.exportFields.id) row.push(String(review.id));
      if (this.exportFields.userName) row.push(`${review.user?.firstName || 'Unknown'} ${review.user?.lastName || 'User'}`);
      if (this.exportFields.originCountry) row.push(review.user?.originCountry || 'Unknown Country');
      if (this.exportFields.heritageSite) row.push(review.heritageSite?.name || 'Unknown Site');
      if (this.exportFields.location) row.push(review.heritageSite?.location || 'Unknown Location');
      if (this.exportFields.rating) row.push(review.rating?.toFixed(1) || 'N/A');
      if (this.exportFields.comment) row.push(`"${review.comment?.replace(/"/g, '""') || 'No comment provided'}"`);
      if (this.exportFields.createdAt) row.push(this.datePipe.transform(review.createdAt, 'MMM d, yyyy') || 'Unknown Date');
      if (this.exportFields.interests) row.push(review.user?.interests || 'No interests provided');
      return row;
    });

    // Combine headers and rows into CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Close the modal after export
    this.closeExportModal();
  }
}