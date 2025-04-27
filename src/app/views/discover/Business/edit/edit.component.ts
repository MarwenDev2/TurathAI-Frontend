import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Business } from '@core/Models/business';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { BusinessService } from '@core/services/business.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { MapPickerComponent } from '../../event/map-picker/map-picker.component';
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
  businessForm: FormGroup;
  businessId: number = 0;
  business: Business | null = null;
  sites: Site[] = [];
  imageIds: number[] = [];
  isLoading = false;
  isSubmitting = false;
  showMap = false;
  coordinates: { lat: number; lng: number } = { lat: 0, lng: 0 };

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private businessService: BusinessService,
    private router: Router,
    private route: ActivatedRoute
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
    this.isLoading = true;
    this.businessId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    
    if (!this.businessId) {
      this.showErrorAlert('Invalid business ID');
      this.router.navigate(['/businesses/list']);
      return;
    }

    // Load both sites and business data in parallel
    forkJoin({
      sites: this.siteService.getAll(),
      business: this.businessService.getBusinessById(this.businessId)
    }).subscribe({
      next: (data) => {
        this.sites = data.sites;
        this.business = data.business;
        this.populateForm();
      },
      error: (err) => {
        console.error('Failed to load data', err);
        this.showErrorAlert('Failed to load business information');
        this.router.navigate(['/businesses/list']);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    if (!this.business) return;

    // Set image IDs
    if (this.business.imageIds && this.business.imageIds.length > 0) {
      this.imageIds = [...this.business.imageIds];
    } else if (this.business.images && this.business.images.length > 0) {
      this.imageIds = this.business.images.map(img => img.id);
    }

    // Set coordinates
    if (this.business.latitude && this.business.longitude) {
      this.coordinates = {
        lat: this.business.latitude,
        lng: this.business.longitude
      };
    }

    // Populate form
    this.businessForm.patchValue({
      name: this.business.name,
      type: this.business.type,
      contact: this.business.contact,
      heritageSiteId: this.business.heritageSite?.id || '',
      latitude: this.business.latitude,
      longitude: this.business.longitude
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

    this.isSubmitting = true;
    
    const businessData = {
      ...this.businessForm.value,
      id: this.businessId,
      imageIds: this.imageIds
    };

    // If no heritage site is selected, set it to null
    if (!businessData.heritageSiteId) {
      businessData.heritageSiteId = null;
    }

    this.businessService.updateBusiness(this.businessId, businessData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Business updated successfully!');
          this.router.navigate(['/businesses/list']);
        },
        error: (err) => {
          console.error('Error updating business', err);
          this.showErrorAlert('Failed to update business. Please try again.');
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
