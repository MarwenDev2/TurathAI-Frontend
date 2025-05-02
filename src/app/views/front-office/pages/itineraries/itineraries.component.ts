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
import { CarouselComponent, CarouselSlide } from '../../components/carousel/carousel.component';
import { ItineraryRouteMapComponent } from '../../../itenary/itinerary-route-map/itinerary-route-map.component';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';

@Component({
  selector: 'app-front-office-itineraries',
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    HttpClientModule,
    CarouselComponent,
    ItineraryRouteMapComponent
  ]
})
export class FrontOfficeItinerariesComponent implements OnInit {
  itineraries: Itinerary[] = [];
  filteredItineraries: Itinerary[] = [];
  loading = true;
  error: string | null = null;
  currentUser: User | null = null;
  
  // Carousel slides
  carouselSlides: CarouselSlide[] = [
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
  
  // Store stops for each itinerary
  itineraryStops: Map<number, Stop[]> = new Map<number, Stop[]>();
  expandedItinerary: number | null = null;
  
  // Map display control
  showMapForItinerary: number | null = null;
  
  // Search and filter properties
  searchQuery: string = '';
  minPossibleBudget: number = 0;
  maxPossibleBudget: number = 10000;
  minBudget: number = 0;
  maxBudget: number = 10000;
  sortOption: string = 'budgetLow'; // Default sort

  constructor(
    private itineraryService: ItineraryService,
    private stopService: StopService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Error loading user data', err);
      }
    });
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
  
    if (!this.currentUser) {
      Swal.fire('You must be logged in to book an itinerary.', '', 'warning');
      return;
    }
  
    const updatedItinerary = {
      ...itinerary,
      user: this.currentUser // Adjust this to match your backend's expected format
    };
  
    this.itineraryService.updateItinerary(updatedItinerary).subscribe({
      next: () => {
        Swal.fire('Booking Confirmed!', 'You have successfully booked the itinerary.', 'success');
        this.loadItineraries(); // Refresh data
      },
      error: (err) => {
        console.error('Booking failed:', err);
        Swal.fire('Booking Failed', 'An error occurred while booking.', 'error');
      }
    });
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
  
  // Show route map in a modal
  showRouteMap(itineraryId: number): void {
    const stops = this.getStopsForItinerary(itineraryId);
    
    Swal.fire({
      title: 'Itinerary Route Map is Above',
      html: `<div id="route-map-modal" style="height: 100px; width: 60%;"></div>`,
      width: '60%',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
      didOpen: () => {
        // Set the itinerary to show the map for
        this.showMapForItinerary = itineraryId;
        
        // Need to render the map after the modal is fully open
        setTimeout(() => {
          const mapContainer = document.getElementById('route-map-modal');
          if (mapContainer) {
            const routeMapComponent = new ItineraryRouteMapComponent();
            routeMapComponent.stops = stops;
            // Initialize and render the map
            // Note: This is a simplified approach. In a real implementation,
            // we would use a more robust way to render the component
            routeMapComponent.ngAfterViewInit();
          }
        }, 300);
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
  
  // Format location for a stop
  formatLocation(location: string | undefined): string {
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
      '36.8065,10.1815': 'Tunis, Tunisia'
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
    
    // If we can't match it, just return the original
    return location;
  }
  
  private isCoordinates(str: string): boolean {
    // Simple check to see if a string contains coordinates
    const regex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    return regex.test(str);
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
}