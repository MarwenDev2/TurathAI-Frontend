import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ItenaryService } from '@core/services/itinerary.service';
import { Itinery } from '@core/Models/itinerary';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './details.component.html'
})
export class DetailsComponent implements OnInit {
  itenaryId: number = 0;
  itenary?: Itinery;
  isLoading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itenaryService: ItenaryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.itenaryId = +id;
        this.loadItenary(this.itenaryId);
      } else {
        this.showErrorAlert('Invalid itinerary ID');
        this.router.navigate(['/itenary/list']);
      }
    });
  }

  loadItenary(id: number): void {
    this.isLoading = true;
    this.error = false;
    
    this.itenaryService.getById(id).subscribe({
      next: (data) => {
        this.itenary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading itinerary', err);
        this.error = true;
        this.isLoading = false;
        this.showErrorAlert('Failed to load itinerary. Please try again.');
      }
    });
  }

  formatDate(dateValue: string | Date | undefined): string {
    if (!dateValue) return 'Not specified';
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  showQRCode(id: number): void {
    Swal.fire({
      title: 'Itinerary QR Code',
      imageUrl: this.itenaryService.getQRCode(id),
      imageAlt: 'Itinerary QR Code',
      confirmButtonText: 'Download',
      showCancelButton: true,
      cancelButtonText: 'Close',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-light w-xs mt-2'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Download QR code image
        const link = document.createElement('a');
        link.href = this.itenaryService.getQRCode(id);
        link.download = `itinerary-${id}-qrcode.png`;
        link.click();
      }
    });
  }

  deleteItenary(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-danger w-xs me-2 mt-2',
        cancelButton: 'btn btn-light w-xs mt-2'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.itenaryService.delete(this.itenaryId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Itinerary has been deleted.',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-primary w-xs me-2 mt-2'
              },
              buttonsStyling: false
            });
            this.router.navigate(['/itenary/list']);
          },
          error: (err) => {
            console.error('Error deleting itinerary', err);
            this.showErrorAlert('Failed to delete itinerary. Please try again.');
          }
        });
      }
    });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger w-xs me-2 mt-2'
      },
      buttonsStyling: false
    });
  }
}
