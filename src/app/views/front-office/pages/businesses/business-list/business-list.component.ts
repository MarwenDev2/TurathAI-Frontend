import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Business } from '@core/Models/business';
import { BusinessService } from '@core/services/business.service';
import { NgbPaginationModule, NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CarouselComponent, CarouselSlide } from '../../../components/carousel/carousel.component';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule, NgbRatingModule, NgbTooltipModule, CarouselComponent, FormsModule],
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('viewChange', [
      transition('* => *', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  filteredBusinesses: Business[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  sortBy: string = 'name';
  isGridView: boolean = true;
  wishlistItems: number[] = [];
  categories: { id: string, name: string }[] = [
    { id: 'Restaurant', name: 'Restaurant' },
    { id: 'Hotel', name: 'Hotel' },
    { id: 'Shop', name: 'Shop' },
    { id: 'Museum', name: 'Museum' },
    { id: 'Craft', name: 'Craft' }
  ];
  
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
    this.loadWishlist();
  }
  
  loadWishlist(): void {
    const wishlistString = localStorage.getItem('businessWishlist');
    if (wishlistString) {
      this.wishlistItems = JSON.parse(wishlistString);
    }
  }

  loadBusinesses() {
    this.loading = true;
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        this.businesses = data;
        this.filteredBusinesses = [...data];
        this.totalItems = data.length;
        this.loading = false;
        this.sortBusinesses();
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
    return this.filteredBusinesses.slice(startIndex, startIndex + this.pageSize);
  }

  // Navigate to business details
  viewBusinessDetails(id: number) {
    this.router.navigate(['/front-office/businesses', id]);
  }

  getBusinessImage(business: Business): string {
    // Check for images array first
    if (business.images && business.images.length > 0) {
      if (typeof business.images[0] === 'object' && business.images[0].id) {
        return `${this.businessService.getImageBaseUrl()}/${business.images[0].id}`;
      } else if (typeof business.images[0] === 'object' && business.images[0].url) {
        return business.images[0].url;
      }
    }
    
    // Then check imageIds
    if (business.imageIds && business.imageIds.length > 0) {
      return this.businessService.getImageUrl(business.imageIds[0]);
    }
    
    // Default placeholder based on business type
    const typeMap: {[key: string]: string} = {
      'Restaurant': 'assets/images/placeholder-restaurant.jpg',
      'Hotel': 'assets/images/placeholder-hotel.jpg',
      'Shop': 'assets/images/placeholder-shop.jpg',
      'Museum': 'assets/images/placeholder-museum.jpg'
    };
    
    return typeMap[business.type] || 'assets/images/placeholder.jpg';
  }

  // Handle image loading errors
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
    imgElement.style.opacity = '0.7';
  }
  
  // Toggle between grid and list view
  toggleView() {
    this.isGridView = !this.isGridView;
  }
  
  // Filter businesses by search term
  onSearchInput(): void {
    this.filterBusinesses();
  }
  
  // Filter businesses by category
  filterByCategory(): void {
    this.filterBusinesses();
  }
  
  // Combined filter function
  filterBusinesses(): void {
    if (!this.searchTerm && !this.selectedCategory) {
      this.filteredBusinesses = [...this.businesses];
    } else {
      this.filteredBusinesses = this.businesses.filter(business => {
        const matchesSearch = !this.searchTerm || 
          business.name?.toLowerCase().includes(this.searchTerm.toLowerCase());
        
        const matchesCategory = !this.selectedCategory || 
          business.type === this.selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    }
    
    this.totalItems = this.filteredBusinesses.length;
    this.page = 1;
    this.sortBusinesses();
  }
  
  // Sort businesses
  sortBusinesses(): void {
    switch(this.sortBy) {
      case 'name':
        this.filteredBusinesses.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'category':
        this.filteredBusinesses.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
        break;
      case 'heritageSite':
        this.filteredBusinesses.sort((a, b) => {
          const siteNameA = a.heritageSite?.name || '';
          const siteNameB = b.heritageSite?.name || '';
          return siteNameA.localeCompare(siteNameB);
        });
        break;
      default:
        break;
    }
  }
  
  // Change sort method
  sortSites(): void {
    this.sortBusinesses();
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
  
  // Format business location
  formatLocation(location: string | undefined): string {
    if (!location) return 'Location unavailable';
    return location;
  }
}
