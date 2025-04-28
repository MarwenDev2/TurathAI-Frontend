import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../../core/services/review.service';
import { SiteService } from '../../../core/services/site.service';
import { Review } from '../../../core/Models/review';
import { Site } from '../../../core/Models/site';
import { User } from '../../../core/Models/user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbRatingModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbRatingModule, NgbProgressbarModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  review: Review = {
    id: 0,
    rating: 0,
    comment: '',
    createdAt: new Date().toISOString().split('T')[0],
    flagged: false,
    user: { id: 1 } as User,
    heritageSite: { id: 0 } as Site
  };
  heritageSites: Site[] = [];
  filteredSites: Site[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isLoadingSites: boolean = false;
  isSubmitting: boolean = false;
  hovered: number = 0;
  loadProgress: number = 0; // Progress for loading sites
  submitProgress: number = 0; // Progress for submission
  currentUser: User | null = null;
  
  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    private heritageSiteService: SiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (this.currentUser) {
          this.review.user = { id: this.currentUser.id } as User;
        }
      },
      error: (err) => {
        console.error('Error loading user data', err);
      }
    });
    this.loadHeritageSites();
  }
  

  loadHeritageSites(): void {
    this.isLoadingSites = true;
    this.loadProgress = 10; // Start at 10%
    const progressInterval = setInterval(() => {
      this.loadProgress = Math.min(this.loadProgress + 10, 90); // Increment up to 90%
    }, 200);

    this.heritageSiteService.getAll().subscribe({
      next: (sites) => {
        clearInterval(progressInterval);
        this.loadProgress = 100; // Complete progress
        this.heritageSites = sites || [];
        this.filteredSites = sites || [];
        setTimeout(() => {
          this.isLoadingSites = false;
          this.loadProgress = 0; // Reset for next load
        }, 1000); // Minimum 1 second
        if (!sites || sites.length === 0) {
          this.errorMessage = 'No heritage sites available.';
        }
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.errorMessage = 'Unable to load heritage sites. Please try again later.';
        setTimeout(() => {
          this.isLoadingSites = false;
          this.loadProgress = 0;
        }, 1000);
      }
    });
  }

  filterSites(): void {
    console.log('Search term:', this.searchTerm);
    console.log('Heritage sites:', this.heritageSites);
    if (this.searchTerm.trim()) {
      this.filteredSites = this.heritageSites.filter(site => {
        const name = site.name ? site.name.toLowerCase() : '';
        const location = site.location ? site.location.toLowerCase() : '';
        return name.includes(this.searchTerm.toLowerCase()) || location.includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.filteredSites = [...this.heritageSites];
    }
    console.log('Filtered sites:', this.filteredSites);
    this.showDropdown = true;
  }

  selectSite(site: Site): void {
    this.review.heritageSite = { ...site };
    this.searchTerm = `${site.name} - ${site.location}`;
    this.showDropdown = false;
    console.log('Selected site:', this.review.heritageSite);
  }

  onInputFocus(): void {
    this.showDropdown = true;
    this.filterSites();
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 300);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.review.heritageSite = { id: 0 } as Site;
    this.filteredSites = [...this.heritageSites];
    this.showDropdown = false;
  }

  addReview(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
    this.submitProgress = 10; // Start at 10%
    const progressInterval = setInterval(() => {
      this.submitProgress = Math.min(this.submitProgress + 10, 90); // Increment up to 90%
    }, 200);

    if (!this.review.rating || this.review.rating < 1 || this.review.rating > 5) {
      this.errorMessage = 'Please provide a rating between 1 and 5.';
      clearInterval(progressInterval);
      this.isSubmitting = false;
      this.submitProgress = 0;
      return;
    }
    if (!this.review.comment) {
      this.errorMessage = 'Please provide a comment.';
      clearInterval(progressInterval);
      this.isSubmitting = false;
      this.submitProgress = 0;
      return;
    }
    if (!this.review.heritageSite?.id) {
      console.log('Validation failed: review.heritageSite:', this.review.heritageSite);
      this.errorMessage = 'Please select a heritage site.';
      clearInterval(progressInterval);
      this.isSubmitting = false;
      this.submitProgress = 0;
      return;
    }

    this.reviewService.addReview(this.review).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.submitProgress = 100; // Complete progress
        this.successMessage = 'Review added successfully!';
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0; // Reset for next submission
          this.router.navigate(['/reviews/list']);
        }, 1000); // Minimum 1 second
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.errorMessage = 'Failed to add review: ' + err.message;
        setTimeout(() => {
          this.isSubmitting = false;
          this.submitProgress = 0;
        }, 1000);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/reviews/list']);
  }
}