import { Component, Input, OnInit, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { BusinessService } from '../../../../../core/services/business.service';
import { Business } from '../../../../../core/Models/business';

register();

@Component({
  selector: 'related-business',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="related-businesses">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3 class="fw-bold m-0">Related Businesses</h3>
        <span *ngIf="businesses.length > 0" class="text-muted">{{ businesses.length }} {{ businesses.length === 1 ? 'business' : 'businesses' }} found</span>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading related businesses...</p>
      </div>

      <!-- No businesses state -->
      <div *ngIf="!loading && businesses.length === 0" class="alert alert-info">
        <i class="bx bx-info-circle me-2"></i>
        No related businesses found for this heritage site.
      </div>

      <!-- Business cards - Standard row instead of swiper for better compatibility -->
      <div *ngIf="!loading && businesses.length > 0" class="business-cards">
        <div class="row">
          <div class="col-md-4 mb-4" *ngFor="let business of businesses">
            <div class="business-card">
              <!-- Business image -->
              <div class="business-image">
                <img 
                  [src]="getBusinessImage(business)" 
                  [alt]="business.name"
                  (error)="handleImageError($event)">
                <span class="business-badge">{{ business.type }}</span>
              </div>
              <div class="business-info">
                <h4 class="business-name">{{ business.name }}</h4>
                <div class="business-details">
                  <div class="detail-item">
                    <i class="bx bx-phone"></i>
                    <span>{{ business.contact || 'No contact info' }}</span>
                  </div>
                  <div class="detail-item" *ngIf="business.heritageSite?.location">
                    <i class="bx bx-map"></i>
                    <span>{{ business.heritageSite?.location }}</span>
                  </div>
                  <div class="detail-item" *ngIf="business.latitude || business.longitude">
                    <i class="bx bx-map-pin"></i>
                    <span>{{ business.latitude | number:'1.4-4' }}, {{ business.longitude | number:'1.4-4' }}</span>
                  </div>
                </div>
                <button class="btn btn-sm btn-primary mt-3" (click)="viewBusinessDetails(business.id!)">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fallback display for swiper if needed -->
      <div *ngIf="!loading && businesses.length > 0 && useSwiperFallback" class="swiper-container mt-4">
        <h4 class="mb-3">Carousel View</h4>
        <swiper-container [config]="swiperConfig">
          <swiper-slide *ngFor="let business of businesses">
            <div class="business-card">
              <div class="business-image">
                <img [src]="getBusinessImage(business)" [alt]="business.name">
              </div>
              <div class="p-3">
                <h5>{{ business.name }}</h5>
                <p class="text-muted">{{ business.type }}</p>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </div>
    </div>
  `,
  styles: [`
    .related-businesses {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px 0;
      position: relative;
      box-shadow: 0 2px 15px rgba(0,0,0,0.05);
    }
    h3 {
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .business-cards {
      margin-top: 20px;
    }
    .swiper-container {
      position: relative;
      padding: 0 40px;
      margin-top: 20px;
    }
    .business-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      margin: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease;
    }
    .business-card:hover {
      transform: translateY(-5px);
    }
    .business-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .business-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .business-card:hover .business-image img {
      transform: scale(1.05);
    }
    .business-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .business-info {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    h4 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .business-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 15px;
      flex: 1;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #666;
    }
    .detail-item i {
      font-size: 1.2rem;
      color: #2a7fff;
    }
    .swiper-button-next,
    .swiper-button-prev {
      color: #2a7fff;
      background: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .swiper-button-next:after,
    .swiper-button-prev:after {
      font-size: 20px;
    }
    .swiper-pagination {
      position: relative;
      margin-top: 20px;
    }
    .swiper-pagination-bullet {
      background: #333;
      opacity: 0.5;
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
    }
  `]
})
export class RelatedBusinessComponent implements OnInit, OnChanges {
  @Input() siteId?: number;
  businesses: Business[] = [];
  loading = false;
  useSwiperFallback = false; // Use this to toggle the swiper display if needed

  swiperConfig: SwiperOptions = {
    slidesPerView: 3, // Show 3 slides on desktop
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: false,
    breakpoints: {
      // When window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      // When window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 15
      },
      // When window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 20
      }
    }
  };

  constructor(private businessService: BusinessService) {}

  ngOnInit() {
    if (this.siteId) {
      this.loadRelatedBusinesses();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['siteId'] && !changes['siteId'].firstChange) {
      console.log('SiteId changed:', this.siteId);
      this.loadRelatedBusinesses();
    }
  }

  private loadRelatedBusinesses() {
    if (!this.siteId) return;
    
    this.loading = true;
    console.log(`Loading related businesses for site ID: ${this.siteId}`);
    
    this.businessService.getBusinessesBySiteId(this.siteId).subscribe({
      next: (businesses) => {
        console.log('Received businesses:', businesses);
        this.businesses = businesses;
        this.loading = false;
        
        // Add additional logging to debug business data
        businesses.forEach((business, index) => {
          console.log(`Business ${index + 1}:`, {
            id: business.id,
            name: business.name,
            type: business.type,
            hasImages: business.images && business.images.length > 0,
            hasImageIds: business.imageIds && business.imageIds.length > 0,
            location: business.heritageSite?.location || `${business.latitude}, ${business.longitude}`
          });
        });
      },
      error: (error) => {
        console.error('Error loading related businesses:', error);
        this.loading = false;
      }
    });
  }
  
  getBusinessImage(business: Business): string {
    // Check for images array first
    if (business.images && business.images.length > 0) {
      if (typeof business.images[0] === 'object' && business.images[0].id) {
        return `http://localhost:9090/images/${business.images[0].id}`;
      } else if (typeof business.images[0] === 'object' && business.images[0].url) {
        return business.images[0].url;
      }
    }
    
    // Then check imageIds
    if (business.imageIds && business.imageIds.length > 0) {
      return `http://localhost:9090/images/${business.imageIds[0]}`;
    }
    
    // Default placeholder based on business type
    const typeMap: {[key: string]: string} = {
      'Restaurant': 'assets/images/placeholder.jpg',
      'Hotel': 'assets/images/placeholder.jpg',
      'Shop': 'assets/images/placeholder.jpg',
      'Museum': 'assets/images/placeholder.jpg'
    };
    
    return typeMap[business.type] || 'assets/images/placeholder.jpg';
  }
  
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
    img.style.opacity = '0.8';
    console.log('Image error handled, using placeholder');
  }
  
  viewBusinessDetails(id: number): void {
    window.open(`/businesses/details/${id}`, '_blank');
  }
} 