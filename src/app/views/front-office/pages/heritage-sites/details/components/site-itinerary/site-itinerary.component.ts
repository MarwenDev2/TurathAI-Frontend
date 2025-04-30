import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { StopService } from '@core/services/stop.service';
import { ItineraryService, Itinerary } from '../../../../../services/itinerary.service';
import { Stop } from '@core/Models/stop';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';

@Component({
  selector: 'app-site-itinerary',
  templateUrl: './site-itinerary.component.html',
  styleUrls: ['./site-itinerary.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class SiteItineraryComponent implements OnInit {
  @Input() siteId?: number;
  itineraries: Itinerary[] = [];
  filteredItineraries: Itinerary[] = [];
  paginatedItineraries: Itinerary[] = [];
  loading = true;
  error: string | null = null;
  currentUser: any = null;
  userActiveItineraries: Set<number> = new Set<number>();
  loadingActiveState: Set<number> = new Set<number>();
  
  // Store stops for each itinerary
  itineraryStops: Map<number, Stop[]> = new Map<number, Stop[]>();
  expandedItinerary: number | null = null;
  showMapItinerary: number | null = null;
  
  // Search and filter properties
  searchQuery: string = '';
  minPossibleBudget: number = 0;
  maxPossibleBudget: number = 10000;
  minBudget: number = 0;
  maxBudget: number = 10000;
  sortOption: string = 'budgetLow'; // Default sort

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  
    constructor(
      private itineraryService: ItineraryService,
      private stopService: StopService,
      private authService: AuthService
    ) {}
  
    ngOnInit() {
      this.getCurrentUser();
      this.loadItineraries();
    }
  
    loadItineraries() {
      this.loading = true;
      this.error = null;
      
      // Use different service method based on whether we have a siteId
      const itineraryObservable = this.siteId 
        ? this.itineraryService.getItinerariesBySiteId(this.siteId)
        : this.itineraryService.getAllItineraries();
      
      itineraryObservable.subscribe({
        next: (data: any[]) => {
          this.itineraries = data;
          
          // Set the budget range based on actual data
          if (data.length > 0) {
            this.minPossibleBudget = Math.min(...data.map((item: { budget: any; }) => item.budget));
            this.maxPossibleBudget = Math.max(...data.map((item: { budget: any; }) => item.budget));
            this.minBudget = this.minPossibleBudget;
            this.maxBudget = this.maxPossibleBudget;
            
            // Load stops for all itineraries
            this.loadAllStops(data);
          } else {
            this.filteredItineraries = [];
            this.loading = false;
          }
        },
        error: (err: { message: any; }) => {
          console.error('Error loading itineraries:', err);
          this.error = `Failed to load itineraries: ${err.message}. Please check if the API server is running at ${this.itineraryService.getApiUrl()}.`;
          this.loading = false;
        }
      });
    }
  
    formatPrice(price: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    }
  
    onBookNow(itinerary: Itinerary) {
      // Implement booking logic here
      console.log('Booking itinerary:', itinerary);
    }
    
    showQRCode(id: number): void {
      // Create a modal to display the QR code
      Swal.fire({
        title: 'Itinerary QR Code',
        imageUrl: this.itineraryService.getQRCode(id),
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: 'Itinerary QR Code',
        confirmButtonText: 'Close',
        showDenyButton: true,
        denyButtonText: 'Download',
        customClass: {
          confirmButton: 'btn btn-primary w-xs me-2 mt-2',
          denyButton: 'btn btn-info w-xs me-2 mt-2',
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isDenied) {
          // Download the QR code image
          const link = document.createElement('a');
          link.href = this.itineraryService.getQRCode(id);
          link.download = `itinerary-${id}-qrcode.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }
    
    // Filter itineraries based on search query and budget range
    filterItineraries(): void {
      this.filteredItineraries = this.itineraries.filter(itinerary => {
        const matchesSearch = this.searchQuery 
          ? itinerary.description.toLowerCase().includes(this.searchQuery.toLowerCase())
          : true;
        
        const matchesBudget = itinerary.budget >= this.minBudget && itinerary.budget <= this.maxBudget;
        
        return matchesSearch && matchesBudget;
      });
      
      this.currentPage = 1; // Reset to first page when filters change
      this.sortItineraries();
    }
    
    // Sort itineraries based on selected option
    sortItineraries(): void {
      switch(this.sortOption) {
        case 'budgetLow':
          this.filteredItineraries.sort((a, b) => a.budget - b.budget);
          break;
        case 'budgetHigh':
          this.filteredItineraries.sort((a, b) => b.budget - a.budget);
          break;
        case 'startDateNewest':
          this.filteredItineraries.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          break;
        case 'startDateOldest':
          this.filteredItineraries.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          break;
      }
      this.updatePagination();
    }
    
    // Clear search
    clearSearch(): void {
      this.searchQuery = '';
      this.filterItineraries();
    }
    
    // Reset all filters
    resetFilters(): void {
      this.searchQuery = '';
      this.minBudget = this.minPossibleBudget;
      this.maxBudget = this.maxPossibleBudget;
      this.sortOption = 'budgetLow';
      this.filterItineraries();
    }
    
    // Load stops for all itineraries
    private loadAllStops(itineraries: Itinerary[]): void {
      // Create an array of observables for each itinerary's stops
      const stopsRequests = itineraries.map(itinerary => 
        this.stopService.getByItineraryId(itinerary.id).pipe(
          map(stops => ({ itineraryId: itinerary.id, stops })),
          catchError(error => {
            console.error(`Error loading stops for itinerary ${itinerary.id}:`, error);
            return of({ itineraryId: itinerary.id, stops: [] });
          })
        )
      );
      
      // Execute all requests in parallel
      forkJoin(stopsRequests).subscribe(results => {
        // Clear the existing map
        this.itineraryStops.clear();
        
        // Store stops for each itinerary in the map
        results.forEach(result => {
          this.itineraryStops.set(result.itineraryId, result.stops);
        });
        
        // Complete the loading process
        this.filteredItineraries = [...this.itineraries];
        this.sortItineraries();
        this.loading = false;
        this.updatePagination();
      });
    }
    
    // Toggle expanded itinerary to show/hide stops
    toggleStops(itineraryId: number): void {
      if (this.expandedItinerary === itineraryId) {
        this.expandedItinerary = null; // Collapse if already expanded
      } else {
        this.expandedItinerary = itineraryId; // Expand this one
      }
    }
  
    toggleMap(itineraryId: number, event?: Event): void {
      if (event) {
        event.stopPropagation(); // Prevent event bubbling
      }
      
      if (this.showMapItinerary === itineraryId) {
        this.showMapItinerary = null;
      } else {
        this.showMapItinerary = itineraryId;
      }
    }
    
    // Check if an itinerary has stops
    hasStops(itineraryId: number): boolean {
      return this.itineraryStops.has(itineraryId) && 
             (this.itineraryStops.get(itineraryId)?.length ?? 0) > 0;
    }
    
    // Get stops for a specific itinerary
    getStopsForItinerary(itineraryId: number): Stop[] {
      return this.itineraryStops.get(itineraryId) || [];
    }
  
    // Get current user information
    getCurrentUser() {
      this.authService.currentUser$.subscribe({
        next: (user: User | null) => {
          this.currentUser = user;
          this.loadUserActiveItineraries();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching current user:', error);
        }
      });
    }
  
    // Load user's active itineraries
    loadUserActiveItineraries() {
      if (!this.currentUser) return;
  
      this.userActiveItineraries.clear();
      this.itineraryService.getItinerariesByUserId(this.currentUser.id).subscribe({
        next: (itineraries: Itinerary[]) => {
          itineraries.forEach((itinerary: Itinerary) => {
            this.userActiveItineraries.add(itinerary.id);
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading user active itineraries:', error);
        }
      });
    }
  
    // Check if an itinerary is active for the current user
    isItineraryActive(itineraryId: number): boolean {
      return this.userActiveItineraries.has(itineraryId);
    }
  
    // Toggle active state of an itinerary
    toggleItineraryActive(itinerary: Itinerary, event: Event) {
      event.stopPropagation(); // Prevent card expand/collapse
      
      if (!this.currentUser) {
        Swal.fire({
          title: 'Sign In Required',
          text: 'Please sign in to add itineraries to your favorites.',
          icon: 'info',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      // Set loading state
      this.loadingActiveState.add(itinerary.id);
  
      if (this.isItineraryActive(itinerary.id)) {
        // Remove from active itineraries
        this.itineraryService.removeItineraryFromUser(itinerary.id).subscribe({
          next: () => {
            this.userActiveItineraries.delete(itinerary.id);
            this.loadingActiveState.delete(itinerary.id);
            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: 'Removed from your itineraries',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error removing itinerary from user:', error);
            this.loadingActiveState.delete(itinerary.id);
            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: 'Failed to remove from your itineraries',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
      } else {
        // Add to active itineraries
        this.itineraryService.assignItineraryToUser(itinerary.id, this.currentUser.id).subscribe({
          next: () => {
            this.userActiveItineraries.add(itinerary.id);
            this.loadingActiveState.delete(itinerary.id);
            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'success',
              title: 'Added to your itineraries',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error adding itinerary to user:', error);
            this.loadingActiveState.delete(itinerary.id);
            Swal.fire({
              toast: true,
              position: 'bottom-end',
              icon: 'error',
              title: 'Failed to add to your itineraries',
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
      }
    }
  
    // Check if the active state is currently loading
    isActiveStateLoading(itineraryId: number): boolean {
      return this.loadingActiveState.has(itineraryId);
    }
  
    // Pagination methods
    updatePagination(): void {
      this.totalPages = Math.ceil(this.filteredItineraries.length / this.itemsPerPage);
      this.totalPages = this.totalPages === 0 ? 1 : this.totalPages; // At least 1 page even if empty
      this.goToPage(this.currentPage); // Ensure current page is valid
    }
  
    goToPage(page: number): void {
      if (page < 1) {
        page = 1;
      } else if (page > this.totalPages) {
        page = this.totalPages;
      }
      
      this.currentPage = page;
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredItineraries.length);
      this.paginatedItineraries = this.filteredItineraries.slice(startIndex, endIndex);
    }
  
    nextPage(): void {
      if (this.currentPage < this.totalPages) {
        this.goToPage(this.currentPage + 1);
      }
    }
  
    prevPage(): void {
      if (this.currentPage > 1) {
        this.goToPage(this.currentPage - 1);
      }
    }
  
    // Generate an array of page numbers for the pagination UI
    getPageNumbers(): number[] {
      const pages: number[] = [];
      // Show max 5 page numbers
      const totalPages = this.totalPages;
      let startPage = Math.max(1, this.currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    }} 