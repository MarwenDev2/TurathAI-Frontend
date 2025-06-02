import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItenaryService } from '@core/services/itinerary.service';
import { StopService } from '@core/services/stop.service';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { HeritageMapPickerComponent } from '../heritage-map-picker/heritage-map-picker.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '@core/Models/user';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeritageMapPickerComponent
  ],
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  itenaryForm: FormGroup;
  isLoading = false;
  showMap = false;
  heritageSites: Site[] = [];
  selectedStops: any[] = [];
  isSiteLoading = false;
  siteLoadError = '';
user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private itenaryService: ItenaryService,
    private stopService: StopService,
    private siteService: SiteService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.itenaryForm = this.fb.group({
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      userId: [1, Validators.required] // Default userId, you might want to get this from auth service
    });
  }

  ngOnInit(): void {
    this.loadHeritageSites();
  }

  loadHeritageSites(): void {
    this.isSiteLoading = true;
    this.siteService.getAll().subscribe({
      next: (sites) => {
        this.heritageSites = sites;
        this.isSiteLoading = false;
      },
      error: (err) => {
        console.error('Error loading heritage sites:', err);
        this.siteLoadError = 'Failed to load heritage sites. Please refresh the page.';
        this.isSiteLoading = false;
      }
    });
  }
  
  toggleMap(): void {
    this.showMap = !this.showMap;
  }
  
  onSitesSelected(sites: any[]): void {
    this.selectedStops = sites;
    
    // Once sites are selected, ensure duration is in days format
    this.selectedStops.forEach(stop => {
      if (!stop.duration.includes('day')) {
        // Convert from hours to days if needed
        const hoursMatch = stop.duration.match(/(\d+)\s*hours?/);
        if (hoursMatch) {
          const hours = parseInt(hoursMatch[1]);
          const days = Math.ceil(hours / 24);
          stop.duration = `${days} day${days !== 1 ? 's' : ''}`;
        } else {
          // Default to 1 day if not specified
          stop.duration = '1 day';
        }
      }
    });
    // IMPORTANT: We don't save the itinerary here - only when the user explicitly submits the form
  }

  onSubmit() {
    if (this.itenaryForm.invalid) {
      this.toastService.error('Please fill out all required fields.');
      return;
    }
  
    if (this.selectedStops.length < 2) {
      this.toastService.error('Please select at least two heritage sites for your itinerary.');
      return;
    }
  
    this.isLoading = true;
  
    // Format form data according to Itinery model
    const formData = {
      ...this.itenaryForm.value,
      startDate: new Date(this.itenaryForm.value.startDate),
      endDate: new Date(this.itenaryForm.value.endDate),
    };
  
    this.itenaryService.add(formData).subscribe({
      next: (createdItinery) => {
        const itineryId = createdItinery.id;
  
        // Prepare stop creation requests
        const stopRequests = this.selectedStops.map((site, index) => {
          const durationInDays = parseInt(site.duration.split(' ')[0]) || 1;
          return this.stopService.add({
            id: 0,
            order: index,
            duration: durationInDays,
            itineryId: itineryId,
            heritageSiteId: site.id
          });
        });
  
        forkJoin(stopRequests).subscribe({
          next: () => {
            this.showSuccessAlert('Itinerary created successfully!');
            this.resetForm();
            this.router.navigate(['/itinerary/list']);
          },
          error: (error) => {
            console.error('Error creating stops:', error);
            this.showErrorAlert('Itinerary was created but there was a problem adding stops.');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error creating itinerary:', error);
        this.showErrorAlert('Failed to create itinerary.');
        this.isLoading = false;
      }
    });
  }
  
  
  // Removed redundant saveItinerary() method to prevent premature saving
  // All saving functionality is now handled by onSubmit() method
  
  // Removed createStops method as its functionality is now handled in onSubmit

  resetForm() {
    this.itenaryForm.reset({
      budget: 0,
      userId: 1
    });
    this.selectedStops = [];
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2'
      },
      buttonsStyling: false
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
