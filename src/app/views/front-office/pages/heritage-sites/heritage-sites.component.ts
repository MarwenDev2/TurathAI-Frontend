import { Component, OnInit, TemplateRef } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/Models/category';
import { WishlistService } from '@core/services/wishlist.service';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';
import { Wishlist } from '@core/Models/wishlist';
import { ReviewService } from '@core/services/review.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselComponent, CarouselSlide } from '../../components/carousel/carousel.component';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Define our own interface for the star template context
interface StarRatingContext {
  fill: number;
}

@Component({
  selector: 'app-heritage-sites',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    ReactiveFormsModule, 
    NgbRatingModule,
    NgbTooltipModule,
    CarouselComponent
  ],
  templateUrl: './heritage-sites.component.html',
  styleUrls: ['./heritage-sites.component.scss']
})
export class HeritageSitesComponent implements OnInit {
  [x: string]: TemplateRef<StarRatingContext> | any;
  sites: Site[] = [];
  filteredSites: Site[] = [];
  categories: Category[] = [];
  featuredSites: Site[] = [];
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'name';
  wishlistSiteIds: number[] = [];
  isGridView = true;
  carouselSlides: any[] = [];
  loading = false;
  userId: number | null = null;
  
  // Review modal
  selectedReviewSite: Site | null = null;
  reviewForm!: FormGroup;
  private reviewModal: any;

  constructor(
    private siteService: SiteService,
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadSites();
    this.loadCategories();
    this.getUserIdAndLoadWishlist();
    this.initializeReviewForm();
    
    // Get current user and load wishlist if logged in
    this.authService.currentUser$.subscribe(user => {
      this.userId = user ? user.id : null;
      if (user) {
        this.loadUserWishlist(user.id);
      }
    });
    
    // Initialize carousel slides
    this.carouselSlides = [
      { image: 'assets/images/carousel/Tunis-Medina-Panorama-View.jpg' },
      { image: 'assets/images/carousel/tunisia-travel-guide-64.jpg' },
      { image: 'assets/images/carousel/tunisia-2_2.jpg' },
      { image: 'assets/images/carousel/tunisia-1_2.jpg' },
      { image: 'assets/images/carousel/shu-Tunisia-SidiBouSaid-760300645-1440x823' },
      { image: 'assets/images/carousel/images.jpeg' },
      { image: 'assets/images/carousel/download (3).jpeg' },
      { image: 'assets/images/carousel/1213a0c2-city-32784-16b8fc4f8fa.jpg' },
      { image: 'assets/images/carousel/60bbde55.jpg' },
      { image: 'assets/images/carousel/Monastir-tunisia.jpg' },
      { image: 'assets/images/carousel/El-Jem-Amphitheatre.jpg' },
    ];
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
   * Open modal to add a review for a heritage site
   */
  openAddReviewModal(site: Site): void {
    if (!this.userId) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to leave a review',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (!site) {
      Swal.fire({
        title: 'Error',
        text: 'Heritage site information is missing',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    this.selectedReviewSite = site;
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
   * Submit a review for a heritage site
   */
  submitReview(): void {
    if (!this.reviewForm.valid || !this.selectedReviewSite || !this.userId) {
      return;
    }
    
    const review = {
      id: 0, // Will be assigned by the backend
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.content,
      createdAt: new Date().toISOString(),
      flagged: false,
      user: { id: this.userId } as User,
      heritageSite: this.selectedReviewSite,
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
        
        // Update the site's average rating locally
        if (this.selectedReviewSite) {
          // Simple average calculation (this is just an estimate until we fetch fresh data)
          const currentRating = this.selectedReviewSite.averageRating || 0;
          const newRating = (currentRating + this.reviewForm.value.rating) / 2;
          this.selectedReviewSite.averageRating = newRating;
        }
        
        if (this.reviewModal) {
          this.reviewModal.hide();
        }
      },
      error: (error: any) => {
        console.error('Error submitting review:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to submit review',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  loadSites() {
    this.loading = true;
    this.siteService.getAllWithRatings().subscribe({
      next: (sites) => {
        console.log('Loaded sites:', sites);
        sites.forEach(site => {
          console.log(`Site ${site.name} has ID:`, site.id);
        });
        this.sites = sites;
        this.filteredSites = [...sites];
        
        // Setup featured sites for carousel
        this.featuredSites = sites
          .filter(site => site.imageIds && site.imageIds.length > 0)
          .slice(0, 3);
          
        // Create carousel slides
        this.carouselSlides = this.featuredSites.map(site => ({
          id: site.id,
          image: this.getSiteImage(site.imageIds),
          title: site.name,
          description: site.description?.substring(0, 150) + '...',
          link: '/frontoffice/heritage-sites/details/' + site.id
        }));
        
        this.sortSites();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sites:', error);
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  getUserIdAndLoadWishlist() {
    const currentUser = this.authService.currentUser;
    if (currentUser && currentUser.id) {
      this.userId = currentUser.id;
      this.loadUserWishlist(currentUser.id);
    } else {
      console.warn('No authenticated user found');
    }
  }

  loadUserWishlist(userId: number): void {
    this.wishlistService.getWishlist(userId).subscribe({
      next: (wishlistItems: Wishlist[]) => {
        // Extract site IDs from wishlist items
        this.wishlistSiteIds = wishlistItems.map(item => item.heritageSite.id);
      },
      error: (error: any) => {
        console.error('Error loading wishlist:', error);
      }
    });
  }

  onSearchInput() {
    this.filterSites();
  }

  filterByCategory() {
    this.filterSites();
  }

  filterSites() {
    this.filteredSites = this.sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          this.formatLocation(site.location).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          site.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || site.categoryId === +this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    this.sortSites();
  }

  sortSites() {
    this.filteredSites.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularityScore - a.popularityScore;
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });
  }

  getSiteImage(imageIds: number[] | undefined): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.png';
    }
    return `${environment.apiUrl}/images/${imageIds[0]}`;
  }
  
  formatLocation(location: string): string {
    if (!location) return 'Unknown location';
    
    // If the location contains a comma and is not coordinates, it might already be in City, Country format
    if (location.includes(',') && !this.isCoordinates(location)) {
      return location.trim();
    }
    
    // For coordinates, use a reverse geocoding approach
    // Since we don't have a real geocoding API, we'll use a mapping for the demo
    const coordinatesMapping: {[key: string]: string} = {
      '37.528275,14.524268': 'Sicily, Italy',
      '10.323,36.8531': 'Sousse, Tunisia',
      '36.857175,10.191273': 'Tunis, Tunisia',
      '36.9430,10.2840': 'Carthage, Tunisia',
      '35.7677,10.8256': 'Monastir, Tunisia',
      '33.8902,10.0982': 'Gabes, Tunisia',
      '37.2742,9.8706': 'Bizerte, Tunisia',
      '31.7917,35.2006': 'Jerusalem, Israel',
      '40.7128,-74.0060': 'New York, USA',
      '40.4168,-3.7038': 'Madrid, Spain',
      '48.8566,2.3522': 'Paris, France',
      '41.9028,12.4964': 'Rome, Italy',
      '51.5074,-0.1278': 'London, UK',
      '52.5200,13.4050': 'Berlin, Germany',
      '35.6762,139.6503': 'Tokyo, Japan',
      '37.7749,-122.4194': 'San Francisco, USA',
      '34.0522,-118.2437': 'Los Angeles, USA',
      '41.3851,2.1734': 'Barcelona, Spain',
      '55.7558,37.6173': 'Moscow, Russia'
    };
    
    // Clean up the input coordinates by removing spaces
    const cleanCoords = location.replace(/\s+/g, '');
    
    // Try to find an exact match in our mapping
    if (coordinatesMapping[cleanCoords]) {
      return coordinatesMapping[cleanCoords];
    }
    
    // If no exact match, try to find the closest coordinates
    // This is a simple approach and would be better handled by a real geocoding service
    for (const coords in coordinatesMapping) {
      if (this.areCoordinatesClose(cleanCoords, coords)) {
        return coordinatesMapping[coords];
      }
    }
    
    // If we still can't match it, try to detect if it's a coordinate format but not in our database
    if (this.isCoordinates(location)) {
      try {
        const [lat, lng] = location.split(',').map(n => parseFloat(n.trim()));
        
        // Rough regions based on lat/lng
        if (lat >= 33 && lat <= 38 && lng >= 8 && lng <= 12) {
          return 'Tunisia'; // Generic Tunisia region
        } else if (lat >= 35 && lat <= 45 && lng >= 7 && lng <= 18) {
          return 'Southern Europe';
        } else if (lat >= 30 && lat <= 50 && lng >= -10 && lng <= 40) {
          return 'Europe';
        } else {
          return 'International Location';
        }
      } catch (e) {
        return location; // If parsing fails, return as is
      }
    }
    
    // If it's not coordinates and no match found, return as is
    return location;
  }

  isCoordinates(str: string): boolean {
    // Simple check for coordinate format (could be enhanced)
    return /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(str);
  }

  areCoordinatesClose(coords1: string, coords2: string): boolean {
    try {
      const [lat1, lng1] = coords1.split(',').map(n => parseFloat(n.trim()));
      const [lat2, lng2] = coords2.split(',').map(n => parseFloat(n.trim()));
      
      // Simple distance calculation (could be enhanced)
      const latDiff = Math.abs(lat1 - lat2);
      const lngDiff = Math.abs(lng1 - lng2);
      
      return latDiff < 0.5 && lngDiff < 0.5; // Within ~50km or so
    } catch (e) {
      return false;
    }
  }

  /**
   * Toggle a site in the wishlist
   * @param siteId The ID of the site to toggle
   */
  toggleWishlist(siteId: number): void {
    if (!this.userId) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to save sites to your wishlist',
        icon: 'warning'
      });
      return;
    }

    const isInWishlist = this.isInWishlist(siteId);
    
    if (isInWishlist) {
      // Find the wishlist entry to remove
      this.wishlistService.getWishlist(this.userId).subscribe({
        next: (wishlistItems: Wishlist[]) => {
          const wishlistItem = wishlistItems.find(item => item.heritageSite?.id === siteId);
          if (wishlistItem && wishlistItem.id) {
            this.wishlistService.removeWishlist(wishlistItem.id).subscribe({
              next: (response: any) => {
                console.log('Removed from wishlist:', response);
                // Remove from local array
                this.wishlistSiteIds = this.wishlistSiteIds.filter(id => id !== siteId);
                
                Swal.fire({
                  title: 'Removed!',
                  text: 'Site has been removed from your wishlist.',
                  icon: 'success',
                  timer: 1500,
                  showConfirmButton: false
                });
              },
              error: (error: any) => {
                console.error('Error removing from wishlist:', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to remove from wishlist',
                  icon: 'error'
                });
              }
            });
          } else {
            console.error('Wishlist item not found for site:', siteId);
          }
        },
        error: (error: any) => {
          console.error('Error fetching wishlist to remove item:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to access your wishlist',
            icon: 'error'
          });
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(this.userId, siteId).subscribe({
        next: () => {
          // Add to local array if not already there
          if (!this.wishlistSiteIds.includes(siteId)) {
            this.wishlistSiteIds.push(siteId);
          }
          
          Swal.fire({
            title: 'Added!',
            text: 'Site has been added to your wishlist.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to add to wishlist',
            icon: 'error'
          });
        }
      });
    }
  }

  /**
   * Check if a site is in the wishlist
   * @param siteId The ID of the site to check
   * @returns Whether the site is in the wishlist
   */
  isInWishlist(siteId: number): boolean {
    return this.wishlistSiteIds.includes(siteId);
  }
  
  /**
   * Get the tooltip text for a wishlist button
   * @param siteId The ID of the site
   * @returns The tooltip text
   */
  getWishlistTooltip(siteId: number): string {
    return this.isInWishlist(siteId) 
      ? 'Remove from Wishlist' 
      : 'Add to Wishlist';
  }

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bg-danger';
      case 'Medium':
        return 'bg-warning';
      case 'Low':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-group';
      case 'Medium':
        return 'bx bx-user-plus';
      case 'Low':
        return 'bx bx-user';
      default:
        return 'bx bx-question-mark';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 8) {
      return 'bg-success';
    } else if (score >= 6) {
      return 'bg-info';
    } else if (score >= 4) {
      return 'bg-warning';
    } else {
      return 'bg-danger';
    }
  }

  getScoreIcon(score: number): string {
    if (score >= 8) {
      return 'bx bxs-star';
    } else if (score >= 6) {
      return 'bx bxs-star-half';
    } else if (score >= 4) {
      return 'bx bx-star';
    } else {
      return 'bx bx-x';
    }
  }

  toggleViewMode() {
    this.isGridView = !this.isGridView;
  }
}