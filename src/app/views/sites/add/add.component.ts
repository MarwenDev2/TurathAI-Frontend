import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '@core/Models/category';
import { CategoryService } from '@core/services/category.service';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploaderComponent
  ],
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  siteForm: FormGroup;
  categories: Category[] = [];
  imageIds: number[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private siteService: SiteService,
    private router: Router // Add Router to constructor

  ) {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      location: ['', Validators.required],
      historicalSignificance: [''],
      popularityScore: [0, [Validators.min(0), Validators.max(100)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  onImageIdsChange(ids: number[]) {
    this.imageIds = ids;
  }

  onSubmit() {
    if (this.siteForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    if (this.imageIds.length === 0) {
      this.showErrorAlert('Please upload at least one image');
      return;
    }

    this.isLoading = true;
    
    const siteData: Site = {
      ...this.siteForm.value,
      imageIds: this.imageIds
    };

    this.siteService.add(siteData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Site added successfully!');
          this.resetForm();
          this.router.navigate(['/sites/list']); // Adjust the route as needed
        },
        error: (err) => {
          console.error('Error adding site', err);
          this.showErrorAlert('Failed to add site. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.siteForm.reset({
      popularityScore: 0
    });
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
}