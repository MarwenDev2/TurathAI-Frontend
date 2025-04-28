import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '@core/services/event.service';
import { EventSite } from '@core/Models/event';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { TruncatePipe } from "../../../../core/TruncatePipe";
import * as XLSX from 'xlsx';

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
    TruncatePipe,
    DatePipe
],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  events: EventSite[] = [];
  filteredEvents: EventSite[] = [];
  selectedEvents: number[] = [];
  allSelected: boolean = false;
  page = 1;
  pageSize = 5;
  searchTerm = '';
  currentSort = 'name'; // default sort
  searchSubject = new Subject<string>();
  loading = true;

  stateData = [
    {
      icon: 'solar:calendar-bold-duotone',
      iconColor: 'info',
      amount: '0',
      title: 'Total Events',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-doughnut-chart',
    },
    {
      icon: 'solar:star-bold-duotone',
      iconColor: 'warning',
      amount: '0',
      title: 'Upcoming Events',
      badge: '0',
      badgeColor: 'success',
      badgeIcon: 'bx bx-bar-chart-alt-2',
    },
  ];

  constructor(private eventService: EventService) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.searchEvents();
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.loadStatistics();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        console.log('Received events:', data); // Debug log
        this.events = data;
        this.filteredEvents = [...this.events];
        this.sortEvents();
        this.loading = false;
        
        // Verify image URLs
        this.events.forEach(event => {
          if (event.imageIds && event.imageIds.length > 0) {
            console.log(`Event ${event.id} image URLs:`, 
              event.imageIds.map(id => this.getImageUrl(id)));
          }
        });
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }
  loadStatistics(): void {
    this.eventService.getEventCount().subscribe({
      next: (count) => {
        this.stateData[0].amount = count.toString();
        this.stateData[0].badge = '↑5%';
      },
      error: (err) => {
        console.error('Error fetching event count:', err);
      }
    });

    this.eventService.getUpcomingEventCount().subscribe({
      next: (count) => {
        this.stateData[1].amount = count.toString();
        this.stateData[1].badge = '↑3%';
      },
      error: (err) => {
        console.error('Error fetching upcoming event count:', err);
      }
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  searchEvents(): void {
    if (!this.searchTerm) {
      this.filteredEvents = [...this.events];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredEvents = this.events.filter(event => 
        event.location.toLowerCase().includes(term) ||
        event.name.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term));
    }
    this.page = 1;
    this.sortEvents();
  }

  sortBy(field: string): void {
    this.currentSort = field;
    this.sortEvents();
  }

  sortEvents(): void {
    switch (this.currentSort) {
      case 'name':
        this.filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'startDate':
        this.filteredEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'location':
        this.filteredEvents.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        this.filteredEvents.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  get paginatedEvents(): EventSite[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredEvents.slice(start, end);
  }
  getImageUrls(imageIds: number[]): string[] {
    if (!imageIds || imageIds.length === 0) {
      return ['assets/default.jpg']; // Make sure this path is correct
    }
    return imageIds.map(id => `${this.getImageUrl(id)}?${Date.now()}`); // Add cache buster
  }
  
  getImageUrl(imageId: number): string {
    return this.eventService.getImageUrl(imageId);
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default.jpg';
    imgElement.style.opacity = '0.7';
  }

  deleteEvent(id: number): void {
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
        this.eventService.deleteEvent(id).subscribe({
          next: () => {
            this.events = this.events.filter(e => e.id !== id);
            this.filteredEvents = this.filteredEvents.filter(e => e.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'The event has been deleted.',
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
              text: 'Failed to delete the event.',
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

  toggleSelection(eventId: number) {
    const index = this.selectedEvents.indexOf(eventId);
    if (index === -1) {
      this.selectedEvents.push(eventId);
    } else {
      this.selectedEvents.splice(index, 1);
    }
    this.checkIfAllSelected();
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.selectedEvents = this.paginatedEvents.map(event => event.id!);
    } else {
      this.selectedEvents = [];
    }
  }

  checkIfAllSelected() {
    this.allSelected = this.paginatedEvents.every(event => this.selectedEvents.includes(event.id!));
  }

  deleteSelectedEvents() {
    if (confirm('Are you sure you want to delete the selected events?')) {
      this.selectedEvents.forEach(id => this.deleteEvent(id));
      this.selectedEvents = [];
      this.allSelected = false;
    }
  }

  isUpcoming(event: EventSite): boolean {
    return new Date(event.startDate) > new Date();
  }
  
  /**
   * Export events data to Excel file
   */
  exportToExcel(): void {
    // Create a formatted data array for Excel
    const datePipe = new DatePipe('en-US');
    const exportData = this.events.map(event => ({
      'Name': event.name,
      'Description': event.description,
      'Start Date': datePipe.transform(event.startDate, 'yyyy-MM-dd'),
      'End Date': datePipe.transform(event.endDate, 'yyyy-MM-dd'),
      'Location': event.location,
      'Heritage Site': event.site?.name || event.heritageSite?.name || 'Not linked',
      'Status': this.isUpcoming(event) ? 'Upcoming' : 'Past',
      'Images Count': event.images?.length || event.imageIds?.length || 0
    }));

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create column widths
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Description
      { wch: 12 }, // Start Date
      { wch: 12 }, // End Date
      { wch: 15 }, // Location
      { wch: 15 }, // Heritage Site
      { wch: 10 }, // Status
      { wch: 10 }  // Images Count
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

    // Save to file
    const fileName = `Events_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}