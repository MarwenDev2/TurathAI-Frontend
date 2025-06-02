import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { currency } from '@common/constants';
// Removed unused import
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common';
import { Site } from '@core/Models/site';
import { Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '@core/services/site.service';
import { CategoryService } from '@core/services/category.service';
import { ReviewService } from '@core/services/review.service';


@Component({
  selector: 'site-info-detail',
  standalone: true,
  imports: [NgbRatingModule, CommonModule],
  templateUrl: './site-info.component.html',
  styles: [`
    .filled {
      position: absolute;
      left: 0;
      overflow: hidden;
    }
  `]
})
export class SiteInfoComponent implements OnChanges {
  currency=currency
  @Input() site!: Site;

  rating: number = 0;
  hasRating: boolean = false;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.site && this.site.id) {
      this.updateRating();
    }
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
        error: (error: any) => {
          console.error('Error calculating average rating:', error);
          this.hasRating = false;
          this.rating = 0;
        }
      });
    }
  }

  categoriesMap = new Map<number, string>();

  ngOnInit(): void {
    this.loadData();
  }
  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService,
    private reviewService: ReviewService
  ) {}

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));}

    )};
  

  getCategoryName(categoryId: number): string {
  return this.categoriesMap.get(categoryId) || 'Unknown';
}

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'badge bg-success';
      case 'Medium':
        return 'badge bg-warning';
      case 'Low':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
  
  getExpectedPopularityFromScore(score: number): string {
    if (score >= 8) {
      return 'High';
    } else if (score >= 5) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

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
