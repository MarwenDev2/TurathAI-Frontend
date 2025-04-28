import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Business } from '@core/Models/business';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { BusinessService } from '@core/services/business.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MapPickerComponent } from '../../event/map-picker/map-picker.component';

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
  businessForm: FormGroup;
  sites: Site[] = [];
  imageIds: number[] = [];
  isLoading = false;
  showMap = false;
  coordinates: { lat: number; lng: number } = { lat: 0, lng: 0 };

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private businessService: BusinessService,
    private router: Router
  ) {
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      contact: ['', Validators.required],
      heritageSiteId: [''],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required]
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
    if (this.businessForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    if (this.imageIds.length === 0) {
      this.showErrorAlert('Please upload at least one image');
      return;
    }

    this.isLoading = true;
    
    const businessData = {
      ...this.businessForm.value,
      imageIds: this.imageIds
    };

    // If no heritage site is selected, set it to null
    if (!businessData.heritageSiteId) {
      businessData.heritageSiteId = null;
    }

    this.businessService.createBusiness(businessData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Business added successfully!');
          this.resetForm();
          this.router.navigate(['/businesses/list']);
        },
        error: (err) => {
          console.error('Error adding business', err);
          this.showErrorAlert('Failed to add business. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.businessForm.reset();
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
    const [lat, lng] = coords.split(',').map(coord => parseFloat(coord.trim()));
    this.businessForm.patchValue({
      latitude: lat,
      longitude: lng
    });
    this.coordinates = { lat, lng };
    this.showMap = false;
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }
}
