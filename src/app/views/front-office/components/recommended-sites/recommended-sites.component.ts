import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbRatingModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { ReviewService } from '@core/services/review.service';
import { AuthService } from '@core/services/auth.service';
import { WishlistService } from '@core/services/wishlist.service';
import { AIRecommendationService } from '@core/services/ai-recommendation.service';
import { User } from '@core/Models/user';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';
import { of, catchError, forkJoin } from 'rxjs';

@Component({
  selector: 'app-recommended-sites',
  standalone: true,
  imports: [CommonModule, RouterModule, NgbRatingModule, NgbTooltipModule],
  templateUrl: './recommended-sites.component.html',
  styleUrls: ['./recommended-sites.component.scss']
})
export class RecommendedSitesComponent implements OnInit, OnChanges {
  @Input() sites: Site[] = [];
  @Input() title: string = 'Recommended For You';
  @Input() showViewAllLink: boolean = true;
  @Input() currentSiteId?: number; // Optional current site ID for context-based recommendations
  @Input() useAiRecommendations: boolean = false; // Whether to use AI-powered recommendations
  
  wishlist: number[] = [];
  currentUser: User | null = null;
  isLoading: boolean = false;
  recommendationError: string | null = null;

  constructor(
    private siteService: SiteService,
    private authService: AuthService,
    private reviewService: ReviewService,
    private wishlistService: WishlistService,
    private aiRecommendationService: AIRecommendationService
  ) {}

  ngOnInit(): void {
    // Get current user and load wishlist if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadWishlist();
      }
    });
    
    // If no sites provided, load them
    if (this.sites.length === 0) {
      this.loadRecommendations();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // If currentSiteId changes and we're using AI recommendations, reload recommendations
    if (changes['currentSiteId'] && this.useAiRecommendations) {
      this.loadRecommendations();
    }
    
    // If useAiRecommendations changes, reload recommendations
    if (changes['useAiRecommendations'] && this.sites.length === 0) {
      this.loadRecommendations();
    }
  }

  loadRecommendations() {
    this.isLoading = true;
    this.recommendationError = null;
    
    if (this.useAiRecommendations && this.currentSiteId) {
      // Load AI-powered recommendations based on the current site context
      this.loadAiRecommendations(this.currentSiteId);
    } else {
      // Load traditional recommendations based on popularity and ratings
      this.loadDefaultRecommendedSites();
    }
  }
  
  loadDefaultRecommendedSites() {
    this.isLoading = true;
    this.siteService.getAllWithRatings().subscribe({
      next: (sites) => {
        // Only get sites with a score greater than 6.5
        this.sites = sites
          .filter(site => site.popularityScore > 6.5)
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recommended sites:', error);
        this.recommendationError = 'Failed to load recommended sites';
        this.isLoading = false;
      }
    });
  }
  
  loadAiRecommendations(siteId: number) {
    this.isLoading = true;
    console.log(`Requesting AI recommendations for site ID: ${siteId}`);
    
    this.aiRecommendationService.getRecommendations(siteId).subscribe({
      next: (recommendations) => {
        console.log('Received recommendations:', recommendations);
        
        // If we got empty recommendations or invalid data, fallback to default
        if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
          console.log('No valid recommendations received, falling back to defaults');
          this.loadDefaultRecommendedSites();
          this.title = 'Popular Heritage Sites';
          return;
        }
        
        // Convert the AI recommendations to Site objects
        try {
          const recommendedSites = this.aiRecommendationService.convertToSites(recommendations);
          console.log('Converted recommendations to sites:', recommendedSites);
          
          // Get detailed site information for each recommendation
          if (recommendedSites.length > 0) {
            // Load full site details for each recommendation
            this.loadDetailedSiteInfo(recommendedSites);
          } else {
            // If no AI recommendations, fall back to default recommendations
            this.loadDefaultRecommendedSites();
            // Update title to indicate fallback
            this.title = 'Popular Heritage Sites';
          }
        } catch (e) {
          console.error('Error processing recommendations:', e);
          this.recommendationError = 'Error processing recommendations';
          this.loadDefaultRecommendedSites();
          this.title = 'Popular Heritage Sites';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading AI recommendations:', error);
        this.recommendationError = 'AI recommendation service unavailable';
        // Fall back to default recommendations
        this.loadDefaultRecommendedSites();
        // Update title to indicate fallback
        this.title = 'Popular Heritage Sites';
        this.isLoading = false;
      }
    });
  }
  
  loadDetailedSiteInfo(recommendedSites: Site[]) {
    // Create an array of observables for each site detail request
    const siteDetailRequests = recommendedSites.map(site => {
      return this.siteService.getById(site.id).pipe(
        catchError((error: any) => {
          console.error(`Error loading details for site ${site.id}:`, error);
          return of(site); // Return basic site info on error
        })
      );
    });
    
    // Use forkJoin to wait for all requests to complete
    forkJoin(siteDetailRequests).subscribe({
      next: (detailedSites: Site[]) => {
        // Combine AI recommendation scores with detailed site info
        this.sites = detailedSites.map((detailedSite: Site, index: number) => {
          return {
            ...detailedSite,
            popularityScore: recommendedSites[index].popularityScore,
            expectedPopularity: recommendedSites[index].expectedPopularity
          };
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading detailed site information:', error);
        // Use basic recommendation data
        this.sites = recommendedSites;
        this.isLoading = false;
      }
    });
  }

  loadWishlist() {
    if (!this.currentUser) {
      return;
    }
    
    this.wishlistService.getWishlist(this.currentUser.id).subscribe({
      next: (wishlistItems) => {
        // Extract site IDs from wishlist items
        this.wishlist = wishlistItems.map(item => item.heritageSite?.id || 0).filter(id => id !== 0);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.wishlist = [];
      }
    });
  }

  toggleWishlist(siteId: number) {
    if (!this.currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to add items to your wishlist',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    if (this.isInWishlist(siteId)) {
      // Find the wishlist item ID by site ID
      this.wishlistService.getWishlist(this.currentUser.id).pipe(
        // Import switchMap method from rxjs
        catchError((error: any) => {
          console.error('Error fetching wishlist:', error);
          return of([]);
        })
      ).subscribe({
        next: (wishlistItems: any[]) => {
          const wishlistItem = wishlistItems.find((item: any) => item.heritageSite?.id === siteId);
          if (wishlistItem) {
            this.wishlistService.removeWishlist(wishlistItem.id).subscribe({
              next: () => {
                // Remove from local array
                const index = this.wishlist.indexOf(siteId);
                if (index !== -1) {
                  this.wishlist.splice(index, 1);
                }
              },
              error: (error: any) => {
                console.error('Error removing from wishlist:', error);
                Swal.fire({
                  title: 'Error',
                  text: 'Could not remove item from wishlist',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
              }
            });
          }
        },
        error: (error: any) => {
          console.error('Error fetching wishlist:', error);
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist(this.currentUser.id, siteId).subscribe({
        next: () => {
          // Add to local array
          this.wishlist.push(siteId);
        },
        error: (error: any) => {
          console.error('Error adding to wishlist:', error);
          Swal.fire({
            title: 'Error',
            text: 'Could not add item to wishlist',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  isInWishlist(siteId: number): boolean {
    return this.wishlist.includes(siteId);
  }

  getWishlistTooltip(siteId: number): string {
    return this.isInWishlist(siteId) ? 'Remove from wishlist' : 'Add to wishlist';
  }

  /**
   * Open modal to add a review for a heritage site by redirecting to details page
   */
  openAddReviewModal(site: Site): void {
    if (!this.currentUser) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to leave a review',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Redirect to heritage site details page with review modal
    // Add 'review=true' query parameter to trigger the modal opening
    window.location.href = `/frontoffice/heritage-sites/details/${site.id}?review=true#reviews`;
  }

  getSiteImage(imageIds: number[] | undefined): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.jpg';
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
      '34.5521,10.1082': 'Sfax, Tunisia',
      '36.8065,10.1815': 'Tunis, Tunisia',
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
          return 'Mediterranean, Europe';
        } else if (lat >= 30 && lat <= 34 && lng >= 30 && lng <= 36) {
          return 'Middle East';
        } else if (lat >= 35 && lat <= 45 && lng >= -10 && lng <= 5) {
          return 'Western Europe';
        } else if (lat >= 25 && lat <= 50 && lng >= -130 && lng <= -65) {
          return 'North America';
        }
      } catch (e) {
        // If parsing fails, fall back to original
      }
    }
    
    // If we can't match it, just return the original
    return location;
  }
  
  private isCoordinates(str: string): boolean {
    // Improved check to see if a string contains coordinates
    // This pattern matches more coordinate formats
    const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    return regex.test(str.trim());
  }
  
  private areCoordinatesClose(coords1: string, coords2: string): boolean {
    try {
      const [lat1, lon1] = coords1.split(',').map(Number);
      const [lat2, lon2] = coords2.split(',').map(Number);
      
      // Calculate simple Euclidean distance
      // In a real app, you'd want to use the Haversine formula for better accuracy
      const threshold = 0.5; // Roughly 50km at the equator
      const distance = Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
      
      return distance < threshold;
    } catch (e) {
      return false;
    }
  }

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bg-success';
      case 'Medium':
        return 'bg-warning';
      case 'Low':
        return 'bg-danger';
      default:
        return 'bg-info';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-minus';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 8) return 'bg-success';
    if (score >= 5) return 'bg-warning';
    return 'bg-danger';
  }

  getScoreIcon(score: number): string {
    if (score >= 8) return 'bx bx-star';
    if (score >= 5) return 'bx bx-star-half';
    return 'bx bx-star';
  }
}
