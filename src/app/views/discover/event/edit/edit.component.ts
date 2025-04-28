import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventSite } from '@core/Models/event';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { EventService } from '@core/services/event.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MapPickerComponent } from '../map-picker/map-picker.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploaderComponent,
    MapPickerComponent
  ],
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  eventForm: FormGroup;
  eventId: number = 0;
  event: EventSite | null = null;
  sites: Site[] = [];
  imageIds: number[] = [];
  isLoading = false;
  isSubmitting = false;
  showMap = false;
  coordinates: string = '';

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      heritageSiteId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.eventId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    
    if (!this.eventId) {
      this.showErrorAlert('Invalid event ID');
      this.router.navigate(['/event/list']);
      return;
    }

    // Load both sites and event data in parallel
    forkJoin({
      sites: this.siteService.getAll(),
      event: this.eventService.getEventById(this.eventId)
    }).subscribe({
      next: (data) => {
        this.sites = data.sites;
        this.event = data.event;
        this.populateForm();
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.showErrorAlert('Failed to load event information');
        this.router.navigate(['/event/list']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    if (!this.event) return;

    // Set image IDs
    if (this.event.imageIds && this.event.imageIds.length > 0) {
      this.imageIds = [...this.event.imageIds];
    } else if (this.event.images && this.event.images.length > 0) {
      this.imageIds = this.event.images.map(img => img.id);
    }

    // Set coordinates if location exists
    if (this.event.location) {
      this.coordinates = this.event.location;
    }

    // Format dates for input fields
    const startDate = this.event.startDate ? new Date(this.event.startDate) : null;
    const endDate = this.event.endDate ? new Date(this.event.endDate) : null;

    // Format date to 'YYYY-MM-DDThh:mm'
    const formatDateForInput = (date: Date | null) => {
      if (!date) return '';
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    // Populate form
    this.eventForm.patchValue({
      name: this.event.name,
      description: this.event.description,
      startDate: formatDateForInput(startDate),
      endDate: formatDateForInput(endDate),
      location: this.event.location,
      heritageSiteId: this.event.heritageSite?.id?.toString() || ''
    });
  }

  onImageIdsChange(ids: number[]) {
    this.imageIds = ids;
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    if (this.imageIds.length === 0) {
      this.showErrorAlert('Please upload at least one image');
      return;
    }

    this.isSubmitting = true;
    
    const eventData = {
      ...this.eventForm.value,
      id: this.eventId,
      imageIds: this.imageIds
    };

    this.eventService.updateEvent(this.eventId, eventData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Event updated successfully!');
          this.router.navigate(['/event/list']);
        },
        error: (err) => {
          console.error('Error updating event', err);
          this.showErrorAlert('Failed to update event. Please try again.');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
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

  onLocationSelected(coords: string) {
    this.eventForm.patchValue({
      location: coords
    });
    this.coordinates = coords;
    this.showMap = false;
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }
}
