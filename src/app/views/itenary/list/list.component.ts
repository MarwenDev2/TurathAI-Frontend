import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { state2Data } from '../../apps/widgets/data';
import { WidgetState3Component } from '../../apps/widgets/components/widget-state3/widget-state3.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItenaryService } from '@core/services/itinerary.service';
import { Itinery } from '@core/Models/itinerary';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgbPaginationModule, NgbDropdownModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  stateData = [...state2Data]; // Create a copy so we can modify it
  title = 'ITINERARY LIST';
  itenaries: Itinery[] = [];
  filteredItenaries: Itinery[] = [];
  
  // Search properties
  searchId: number | null = null;
  minBudget: number | null = null;
  maxBudget: number | null = null;
  
  // Pagination properties
  page = 1;
  pageSize = 5;
  collectionSize = 0;
  pagedItenaries: Itinery[] = [];

  constructor(
    private itenaryService: ItenaryService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.itenaryService.getAll().subscribe((data: Itinery[]) => {
      this.itenaries = data;
      this.filteredItenaries = [...this.itenaries]; // Initialize filtered itineraries with all itineraries
      this.updateCollectionSize();
      this.refreshItenaries();
      this.updateStateCards();
    });
  }
  
  /**
   * Updates the state cards with real statistics about the itineraries
   */
  updateStateCards(): void {
    if (!this.itenaries || this.itenaries.length === 0) return;
    
    // Calculate total itineraries
    const totalItineraries = this.itenaries.length;
    
    // Calculate low budget itineraries (budget < 3)
    const lowBudgetItineraries = this.itenaries.filter(itinerary => itinerary.budget < 3).length;
    const lowBudgetPercentage = ((lowBudgetItineraries / totalItineraries) * 100).toFixed(2);
    
    // Calculate total budget (income)
    const totalBudget = this.itenaries.reduce((sum, itinerary) => sum + itinerary.budget, 0);
    
    // Calculate average budget per itinerary (expense)
    const avgBudget = totalBudget / totalItineraries;
    
    // Update the state cards
    this.stateData[0] = {
      ...this.stateData[0],
      title: 'Total Itineraries',
      amount: totalItineraries.toString(),
      badge: '100',
      badgeColor: 'success'
    };
    
    this.stateData[1] = {
      ...this.stateData[1],
      title: 'Budget Under $3',
      amount: lowBudgetItineraries.toString(),
      badge: lowBudgetPercentage,
      badgeColor: lowBudgetItineraries > (totalItineraries / 2) ? 'warning' : 'success'
    };
    
    this.stateData[2] = {
      ...this.stateData[2],
      title: 'Total Income',
      amount: (totalBudget / 1000).toFixed(1),  // Display in k format
      badge: '100',
      badgeColor: 'success'
    };
    
    this.stateData[3] = {
      ...this.stateData[3],
      title: 'Avg. Budget',
      amount: (avgBudget / 1000).toFixed(1),  // Display in k format
      badge: '100',
      badgeColor: 'info'
    };
  }
  
  refreshItenaries(): void {
    this.pagedItenaries = this.filteredItenaries
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }
  
  updateCollectionSize(): void {
    this.collectionSize = this.filteredItenaries.length;
  }

  searchItineraries(): void {
    this.filteredItenaries = this.itenaries.filter(itinerary => {
      // Filter by ID if provided
      if (this.searchId !== null && itinerary.id !== this.searchId) {
        return false;
      }
      
      // Filter by minimum budget if provided
      if (this.minBudget !== null && itinerary.budget < this.minBudget) {
        return false;
      }
      
      // Filter by maximum budget if provided
      if (this.maxBudget !== null && itinerary.budget > this.maxBudget) {
        return false;
      }
      
      return true;
    });
    
    // Reset to first page and update collection size
    this.page = 1;
    this.updateCollectionSize();
    this.refreshItenaries();
  }
  
  resetSearch(): void {
    this.searchId = null;
    this.minBudget = null;
    this.maxBudget = null;
    this.filteredItenaries = [...this.itenaries];
    this.updateCollectionSize();
    this.refreshItenaries();
  }
  
  pageChanged(): void {
    this.refreshItenaries();
  }

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

  showQRCode(id: number): void {
    // Create a modal to display the QR code
    Swal.fire({
      title: 'Itinerary QR Code',
      imageUrl: this.itenaryService.getQRCode(id),
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
        link.href = this.itenaryService.getQRCode(id);
        link.download = `itinerary-${id}-qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }

  exportToPdf(): void {
    // Show loading indicator
    Swal.fire({
      title: 'Exporting...',
      text: 'Please wait while we generate your PDF file',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false
    });

    this.itenaryService.exportToPdf().subscribe({
      next: (blob) => {
        // Close loading indicator
        Swal.close();
        
        // Create object URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'itineraries.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'PDF file has been downloaded successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2'
          },
          buttonsStyling: false
        });
      },
      error: (error) => {
        // Close loading indicator
        Swal.close();
        
        console.error('Error exporting to PDF:', error);
        
        // Show error message with details
        Swal.fire({
          title: 'Export Failed',
          text: `Failed to export to PDF. Error: ${error.status} ${error.statusText}`,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger w-xs mt-2'
          },
          buttonsStyling: false
        });
      }
    });
  }

  exportToExcel(): void {
    // Show loading indicator
    Swal.fire({
      title: 'Exporting...',
      text: 'Please wait while we generate your Excel file',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false
    });

    this.itenaryService.exportToExcel().subscribe({
      next: (blob) => {
        // Close loading indicator
        Swal.close();
        
        // Create object URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'itineraries.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show success message
        Swal.fire({
          title: 'Success!',
          text: 'Excel file has been downloaded successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2'
          },
          buttonsStyling: false
        });
      },
      error: (error) => {
        // Close loading indicator
        Swal.close();
        
        console.error('Error exporting to Excel:', error);
        
        // Show error message with details
        Swal.fire({
          title: 'Export Failed',
          text: `Failed to export to Excel. Error: ${error.status} ${error.statusText}`,
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger w-xs mt-2'
          },
          buttonsStyling: false
        });
      }
    });
  }

  deleteItenary(id: number): void {
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
        this.itenaryService.delete(id).subscribe({
          next: () => {
            this.itenaries = this.itenaries.filter((i) => i.id !== id);
            this.collectionSize = this.itenaries.length;
            this.refreshItenaries();
            Swal.fire({
              title: 'Deleted!',
              text: 'The itinerary has been deleted.',
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
              text: 'Failed to delete the itinerary.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'The itinerary is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2',
          },
          buttonsStyling: false,
        });
      }
    });
  }
}