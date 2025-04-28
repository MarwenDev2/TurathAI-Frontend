import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventSite } from '@core/Models/event';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { EventService } from '@core/services/event.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MapPickerComponent } from '../map-picker/map-picker.component';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploaderComponent,
    MapPickerComponent
  ],
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  eventForm: FormGroup;
  sites: Site[] = [];
  imageIds: number[] = [];
  isLoading = false;
  showMap = false; 
  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private eventService: EventService,
    private router: Router
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
    this.loadSites();
  }

  loadSites() {
    this.siteService.getAll().subscribe({
      next: (data) => this.sites = data,
      error: (err) => console.error('Failed to load sites', err)
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

    this.isLoading = true;
    
    const eventData: EventSite = {
      ...this.eventForm.value,
      imageIds: this.imageIds
    };

    this.eventService.createEvent(eventData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Event added successfully!');
          this.resetForm();
          this.router.navigate(['/events/list']);
        },
        error: (err) => {
          console.error('Error adding event', err);
          this.showErrorAlert('Failed to add event. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.eventForm.reset();
    this.imageIds = [];
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
    this.showMap = false;
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }
}