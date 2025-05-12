import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Stop } from '@core/Models/stop';
import { StopService } from '@core/services/stop.service';
import { Itinery } from '@core/Models/itinerary';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { HeritageSiteImageComponent } from './components/site-image/site-image.component';
import { HeritageSiteInfoComponent } from './components/site-info/site-info.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { SiteItineraryComponent } from './components/site-itinerary/site-itinerary.component';
import { SiteLocalInsightsComponent } from './components/site-local-insights/site-local-insights.component';
import { CategoryService } from '@core/services/category.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ReviewService } from '@core/services/review.service';
import { BrowsingHistoryService } from '@core/services/browsing-history.service';
import { User } from '@core/Models/user';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
register();

@Component({
  selector: 'app-heritage-site-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NgbRatingModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    HeritageSiteImageComponent,
    HeritageSiteInfoComponent,
    ReviewsComponent,
    SiteItineraryComponent,
    SiteLocalInsightsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './heritage-site-details.component.html',
  styleUrls: ['./heritage-site-details.component.scss']
})
export class HeritageSiteDetailsComponent implements OnInit {
  siteData!: Site;
  siteId!: number;
  siteImages: string[] = [];
  categoriesMap = new Map<number, string>();
  currentSlide = 0;
  featuredSites: Site[] = [];
  relatedItineraries: Itinery[] = [];
  
  // Review form and modal properties
  reviewForm!: FormGroup;
  currentUser: User | null = null;
  private reviewModal: any;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: true
  };

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService,
    private stopService: StopService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private formBuilder: FormBuilder,
    private browsingHistoryService: BrowsingHistoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.siteId = +params['id'];
        this.loadHeritageSite();
      }
    });
    
    // Load other data
    this.loadData();
    this.loadRelatedItineraries();
    this.initializeReviewForm();
    
    // Get current user for reviews
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    // Check for review parameter in the URL to automatically open the review modal
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['review'] === 'true') {
        // Wait for data to load and DOM to be ready
        setTimeout(() => {
          // First scroll to the reviews section
          const reviewsElement = document.getElementById('reviews');
          if (reviewsElement) {
            reviewsElement.scrollIntoView({ behavior: 'smooth' });
          }
          
          // Then open the review modal after a short delay
          setTimeout(() => {
            this.openReviewModal();
          }, 800);
        }, 500);
      }
    });
    
    // Check for hash fragment to scroll to a specific section
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500);
      }
    });
  }

  /**
   * Load heritage site data
   */
  loadHeritageSite(): void {
    this.siteService.getById(this.siteId).subscribe({
      next: (site: Site) => {
        this.siteData = site;
        console.log('Site data loaded:', site);
        
        // Record this site view in browsing history for AI recommendations
        this.browsingHistoryService.recordSiteView(this.siteId);
        
        // Get site images
        if (site.imageIds && site.imageIds.length > 0) {
          this.siteImages = site.imageIds.map(id => `http://localhost:8080/images/${id}`);
        } else {
          // Use default image if no images available
          this.siteImages = ['assets/images/default-site.jpg'];
        }
        
        // Load other featured sites from the same category if available
        if (site.categoryId) {
          this.siteService.getAll().subscribe(sites => {
            this.featuredSites = sites
              .filter(s => s.id !== this.siteId && s.categoryId === site.categoryId)
              .slice(0, 3); // Limit to 3 featured sites
          });
        }
      },
      error: (error: any) => {
        console.error('Error loading heritage site:', error);
      }
    });
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
   * Open the review modal
   */
  openReviewModal(): void {
    if (!this.currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to leave a review',
        icon: 'warning'
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
   * Submit a review for the current heritage site
   */
  submitReview(): void {
    if (!this.reviewForm.valid || !this.siteData || !this.currentUser) {
      return;
    }
    
    const review = {
      id: 0, // Will be assigned by the backend
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.content,
      createdAt: new Date().toISOString(),
      flagged: false,
      user: { id: this.currentUser.id } as User,
      heritageSite: this.siteData,
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
        
        // Refresh reviews by reloading the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1600);
        
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

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || 'Unknown';
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.featuredSites.length) % this.featuredSites.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.featuredSites.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  loadRelatedItineraries() {
    this.stopService.getBySiteId(this.siteId).subscribe({
      next: (stops: Stop[]) => {
        // Extract unique itineraries from stops
        this.relatedItineraries = stops
          .filter(stop => stop.itinery)
          .map(stop => stop.itinery!)
          .filter((itinery, index, self) => 
            index === self.findIndex((t) => t.id === itinery.id)
          );
        console.log('Related itineraries:', this.relatedItineraries);
      },
      error: (error: any) => {
        console.error('Error loading related itineraries:', error);
      }
    });
  }

  getSiteImage(imageIds: number[] | undefined): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.jpg';
    }
    return `http://localhost:8080/images/${imageIds[0]}`;
  }
}