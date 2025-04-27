import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe, CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '@core/services/business.service';
import { Business } from '@core/Models/business';
import { debounceTime, distinctUntilChanged, Subject, forkJoin, Observable, of } from 'rxjs';
import Swal from 'sweetalert2';
import { TruncatePipe } from "../../../../core/TruncatePipe";
import * as XLSX from 'xlsx';
import { GeocodingService } from '@core/services/geocoding.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    NgbPaginationModule,
    NgbDropdownModule,
    RouterLink,
    CommonModule,
    FormsModule,
    NgbRatingModule,
  ],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  businesses: Business[] = [];
  filteredBusinesses: Business[] = [];
  selectedBusinesses: number[] = [];
  allSelected: boolean = false;
  page = 1;
  pageSize = 5;
  searchTerm = '';
  currentSort = 'name'; // default sort
  searchSubject = new Subject<string>();
  loading = true;

  stateData = [
    {
      icon: 'solar:shop-2-bold-duotone',
      iconColor: 'info',
      amount: '0',
      title: 'Total Businesses',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-doughnut-chart',
    },
    {
      icon: 'solar:buildings-2-bold-duotone',
      iconColor: 'warning',
      amount: '0',
      title: 'Businesses with Images',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-bar-chart-alt-2',
    },
  ];

  // Location cache to avoid redundant API calls
  locationCache: Map<string, string> = new Map();

  constructor(
    private businessService: BusinessService,
    private geocodingService: GeocodingService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchBusinesses();
    });
  }

  ngOnInit(): void {
    this.loadBusinesses();
    this.loadStatistics();
  }

  loadBusinesses(): void {
    this.businessService.getAllBusinesses().subscribe({
      next: (data) => {
        console.log('Received businesses:', data);
        this.businesses = data;
        this.filteredBusinesses = [...this.businesses];
        this.sortBusinesses();
        this.loading = false;
        
        // Verify image URLs
        this.businesses.forEach(business => {
          if (business.imageIds && business.imageIds.length > 0) {
            console.log(`Business ${business.id} image URLs:`, 
              business.imageIds.map(id => this.getImageUrl(id)));
          }
          if (business.images && business.images.length > 0) {
            console.log(`Business ${business.id} has images array:`, business.images);
          }
        });
      },
      error: (error) => {
        console.error('Error loading businesses:', error);
        this.loading = false;
      }
    });
  }

  loadStatistics(): void {
    this.businessService.getAllBusinesses().subscribe({
      next: (businesses) => {
        // Total businesses
        this.stateData[0].amount = businesses.length.toString();
        this.stateData[0].badge = '↑5%';
        
        // Businesses with images
        const businessesWithImages = businesses.filter(b => 
          (b.images && b.images.length > 0) || (b.imageIds && b.imageIds.length > 0)
        ).length;
        this.stateData[1].amount = businessesWithImages.toString();
        this.stateData[1].badge = '↑3%';
      },
      error: (err) => {
        console.error('Error fetching business statistics:', err);
      }
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  searchBusinesses(): void {
    if (!this.searchTerm) {
      this.filteredBusinesses = [...this.businesses];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredBusinesses = this.businesses.filter(business => 
        business.name.toLowerCase().includes(term) ||
        business.type.toLowerCase().includes(term) ||
        business.contact.toLowerCase().includes(term));
    }
    this.page = 1;
    this.sortBusinesses();
  }

  sortBy(field: string): void {
    this.currentSort = field;
    this.sortBusinesses();
  }

  sortBusinesses(): void {
    switch (this.currentSort) {
      case 'name':
        this.filteredBusinesses.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        this.filteredBusinesses.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'location':
        // Sort by latitude/longitude distance from origin (simple approximation)
        this.filteredBusinesses.sort((a, b) => {
          const distA = Math.sqrt(a.latitude * a.latitude + a.longitude * a.longitude);
          const distB = Math.sqrt(b.latitude * b.latitude + b.longitude * b.longitude);
          return distA - distB;
        });
        break;
      default:
        this.filteredBusinesses.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  get paginatedBusinesses(): Business[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredBusinesses.slice(start, end);
  }

  getImageUrl(imageId: number): string {
    return this.businessService.getImageUrl(imageId);
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default.jpg';
    imgElement.style.opacity = '0.7';
  }

  /**
   * Get formatted location (City, Country) from coordinates
   * @param business Business with latitude and longitude
   * @returns Observable with formatted location string
   */
  getLocationName(business: Business): Observable<string> {
    if (!business || !business.latitude || !business.longitude) {
      return of('Unknown location');
    }

    const coordinates = `${business.latitude},${business.longitude}`;
    
    // Check cache first
    if (this.locationCache.has(coordinates)) {
      return of(this.locationCache.get(coordinates) || 'Unknown location');
    }

    return this.geocodingService.getFormattedLocation(coordinates);
  }

  /**
   * Get location name synchronously from cache if available,
   * or return coordinates with async lookup triggered
   */
  getLocationDisplay(business: Business): string {
    if (!business || !business.latitude || !business.longitude) {
      return 'Unknown location';
    }

    const coordinates = `${business.latitude},${business.longitude}`;
    
    // Return from cache if available
    if (this.locationCache.has(coordinates)) {
      return this.locationCache.get(coordinates) || coordinates;
    }

    // Trigger async lookup
    this.geocodingService.getFormattedLocation(coordinates).subscribe(locationName => {
      this.locationCache.set(coordinates, locationName);
      // Force change detection
      this.filteredBusinesses = [...this.filteredBusinesses];
    });

    // Return coordinates while async lookup happens
    return coordinates;
  }

  deleteBusiness(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-danger w-xs mt-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.businessService.deleteBusiness(id).subscribe({
          next: () => {
            this.businesses = this.businesses.filter(b => b.id !== id);
            this.filteredBusinesses = this.filteredBusinesses.filter(b => b.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'The business has been deleted.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the business.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          }
        });
      }
    });
  }

  toggleSelection(businessId: number) {
    const index = this.selectedBusinesses.indexOf(businessId);
    if (index === -1) {
      this.selectedBusinesses.push(businessId);
    } else {
      this.selectedBusinesses.splice(index, 1);
    }
    this.checkIfAllSelected();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.selectedBusinesses = this.paginatedBusinesses.map(business => business.id!);
    } else {
      this.selectedBusinesses = [];
    }
  }

  checkIfAllSelected() {
    this.allSelected = this.paginatedBusinesses.every(business => this.selectedBusinesses.includes(business.id!));
  }

  deleteSelectedBusinesses() {
    if (confirm('Are you sure you want to delete the selected businesses?')) {
      this.selectedBusinesses.forEach(id => this.deleteBusiness(id));
      this.selectedBusinesses = [];
      this.allSelected = false;
    }
  }

  /**
   * Export businesses data to Excel file
   */
  exportToExcel(): void {
    // Create a formatted data array for Excel
    const datePipe = new DatePipe('en-US');
    const exportData = this.businesses.map(business => ({
      'Name': business.name,
      'Type': business.type,
      'Contact': business.contact,
      'Location': `Lat: ${business.latitude}, Long: ${business.longitude}`,
      'Heritage Site': business.heritageSite?.name || 'Not linked',
      'Images Count': business.images?.length || business.imageIds?.length || 0
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create column widths
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Type
      { wch: 15 }, // Contact
      { wch: 25 }, // Location
      { wch: 15 }, // Heritage Site
      { wch: 10 }  // Images Count
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');

    // Save to file
    const fileName = `Businesses_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}