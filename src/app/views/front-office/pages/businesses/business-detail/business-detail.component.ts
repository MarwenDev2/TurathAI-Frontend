import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Business } from '@core/Models/business';
import { BusinessService } from '@core/services/business.service';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselComponent, CarouselSlide } from '../../../components/carousel/carousel.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [CommonModule, NgbRatingModule, NgbTooltipModule, CarouselComponent, RouterModule],
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BusinessDetailComponent implements OnInit {
  business: Business | null = null;
  loading = true;
  error = false;
  wishlistItems: number[] = [];
  businessImages: CarouselSlide[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
    this.loadBusiness();
  }

  loadWishlist(): void {
    const wishlistString = localStorage.getItem('businessWishlist');
    if (wishlistString) {
      this.wishlistItems = JSON.parse(wishlistString);
    }
  }

  loadBusiness(): void {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.businessService.getBusinessById(id).subscribe({
      next: (business) => {
        this.business = business;
        this.loading = false;
        this.prepareBusinessImages();
      },
      error: (error) => {
        console.error('Error loading business:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  prepareBusinessImages(): void {
    this.businessImages = [];
    
    // Default carousel slides if no images are available
    if (!this.business) {
      this.businessImages = [
        {
          image: 'assets/images/placeholder.jpg',
          title: 'Business',
          description: 'No images available'
        }
      ];
      return;
    }

    // Add images from the business data
    if (this.business.images && this.business.images.length > 0) {
      this.business.images.forEach(image => {
        this.businessImages.push({
          image: `${this.businessService.getImageBaseUrl()}/${image.id}`,
          title: this.business?.name || 'Business',
          description: ''
        });
      });
    } else if (this.business.imageIds && this.business.imageIds.length > 0) {
      this.business.imageIds.forEach(imageId => {
        this.businessImages.push({
          image: this.businessService.getImageUrl(imageId),
          title: this.business?.name || 'Business',
          description: ''
        });
      });
    } else {
      // No images, use placeholder
      this.businessImages = [
        {
          image: 'assets/images/placeholder.jpg',
          title: this.business?.name || 'Business',
          description: 'No images available'
        }
      ];
    }
  }

  goBack(): void {
    this.router.navigate(['/front-office/businesses']);
  }

  // Toggle wishlist item
  toggleWishlist(id: number): void {
    const index = this.wishlistItems.indexOf(id);
    if (index === -1) {
      this.wishlistItems.push(id);
    } else {
      this.wishlistItems.splice(index, 1);
    }
    localStorage.setItem('businessWishlist', JSON.stringify(this.wishlistItems));
  }
  
  // Check if business is in wishlist
  isInWishlist(id: number): boolean {
    return this.wishlistItems.includes(id);
  }
  
  // Get tooltip text for wishlist button
  getWishlistTooltip(id: number): string {
    return this.isInWishlist(id) ? 'Remove from Favorites' : 'Add to Favorites';
  }

  // Handle image loading errors
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
    imgElement.style.opacity = '0.7';
  }
}
