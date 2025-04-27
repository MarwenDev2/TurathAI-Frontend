import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ItineraryService, Itinerary } from '../../services/itinerary.service';
import { StopService } from '../../../../core/services/stop.service';
import { Stop } from '../../../../core/Models/stop';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-front-office-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    HttpClientModule
  ]
})
export class FrontOfficeItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  filteredItineraries: Itinerary[] = [];
  loading = true;
  error: string | null = null;
  
  // Store stops for each itinerary
  itineraryStops: Map<number, Stop[]> = new Map<number, Stop[]>();
  expandedItinerary: number | null = null;
  
  // Search and filter properties
  searchQuery: string = '';
  minPossibleBudget: number = 0;
  maxPossibleBudget: number = 10000;
  minBudget: number = 0;
  maxBudget: number = 10000;
  sortOption: string = 'budgetLow'; // Default sort

  constructor(
    private itineraryService: ItineraryService,
    private stopService: StopService
  ) {}

  ngOnInit() {
    this.loadItineraries();
  }

  loadItineraries() {
    this.loading = true;
    this.error = null;
    
    this.itineraryService.getAllItineraries().subscribe({
      next: (data) => {
        this.itineraries = data;
        
        // Set the budget range based on actual data
        if (data.length > 0) {
          this.minPossibleBudget = Math.min(...data.map(item => item.budget));
          this.maxPossibleBudget = Math.max(...data.map(item => item.budget));
          this.minBudget = this.minPossibleBudget;
          this.maxBudget = this.maxPossibleBudget;
          
          // Load stops for all itineraries
          this.loadAllStops(data);
        } else {
          this.filteredItineraries = [];
          this.loading = false;
        }
      },
      error: (err) => {
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
  
  // Check if an itinerary has stops
  hasStops(itineraryId: number): boolean {
    return this.itineraryStops.has(itineraryId) && 
           (this.itineraryStops.get(itineraryId)?.length ?? 0) > 0;
  }
  
  // Get stops for a specific itinerary
  getStopsForItinerary(itineraryId: number): Stop[] {
    return this.itineraryStops.get(itineraryId) || [];
  }
}