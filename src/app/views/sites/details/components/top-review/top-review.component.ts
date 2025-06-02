import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { ReviewService } from '@core/services/review.service';
import { Review } from '@core/Models/review';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'detail-top-review',
  standalone: true,
  imports: [NgbRatingModule, CommonModule],
  templateUrl: './top-review.component.html',
  styles: ``
})
export class TopReviewComponent implements OnInit, OnChanges {
  @Input() siteId?: number;
  reviews: Review[] = [];

  constructor(
    private reviewService: ReviewService
  ) {}

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
    if (!this.siteId) {
      console.log('No siteId available');
      return;
    }
    
    console.log('Loading reviews for siteId:', this.siteId);
    this.reviewService.getReviewsByHeritageSite(this.siteId).subscribe({
      next: reviews => {
        console.log('Received reviews:', reviews);
        this.reviews = reviews;
      },
      error: error => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  getRatingText(rating: number): string {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3) return 'Average';
    if (rating >= 2.5) return 'Below Average';
    return 'Poor';
  }
}
