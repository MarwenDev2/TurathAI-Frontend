import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Business } from '@core/Models/business';
import { BusinessService } from '@core/services/business.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CarouselComponent, CarouselSlide } from '../../../components/carousel/carousel.component';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, CarouselComponent],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss']
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  carouselSlides: CarouselSlide[] = [
    {
      image: 'assets/images/businesses/business-banner1.jpg',
      title: 'Discover Local Businesses',
      description: 'Explore unique businesses that preserve and celebrate our heritage'
    },
    {
      image: 'assets/images/businesses/business-banner2.jpg',
      title: 'Support Heritage Tourism',
      description: 'Find authentic experiences and traditional crafts in our community'
    },
    {
      image: 'assets/images/businesses/business-banner3.jpg',
      title: 'Connect with Culture',
      description: 'Experience the living history through local businesses and artisans'
    }
  ];
  currentSlide = 0;
  loading = true;
  error = false;

  // Pagination
  page = 1;
  pageSize = 6;
  totalItems = 0;

  constructor(
    public businessService: BusinessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses() {
    this.loading = true;
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
        this.totalItems = data.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading businesses:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  // Carousel controls
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Get paginated businesses
  get paginatedBusinesses(): Business[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.businesses.slice(startIndex, startIndex + this.pageSize);
  }

  // Navigate to business details
  viewBusinessDetails(id: number) {
    this.router.navigate(['/front-office/businesses', id]);
  }

  getImageUrl(business: Business): string {
    // Handle direct image objects (from the images array)
    if (business.images && business.images.length > 0) {
      return `${this.businessService.getImageBaseUrl()}/${business.images[0].id}`;
    }
    
    // Handle image IDs if direct images aren't available
    if (business.imageIds && business.imageIds.length > 0) {
      return this.businessService.getImageUrl(business.imageIds[0]);
    }
    
    // Default placeholder
    return 'assets/images/placeholder.jpg';
  }

  // Handle image loading errors
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
    imgElement.style.opacity = '0.7';
  }

  getBusinessImage(business: Business): string {
    // Check for images array first
    if (business.images && business.images.length > 0) {
      if (typeof business.images[0] === 'object' && business.images[0].id) {
        return `http://localhost:8080/images/${business.images[0].id}`;
      } else if (typeof business.images[0] === 'object' && business.images[0].url) {
        return business.images[0].url;
      }
    }
    
    // Then check imageIds
    if (business.imageIds && business.imageIds.length > 0) {
      return `http://localhost:8080/images/${business.imageIds[0]}`;
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
}
