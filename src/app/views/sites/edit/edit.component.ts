import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '@core/Models/category';
import { CategoryService } from '@core/services/category.service';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploaderComponent
  ],
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  siteForm: FormGroup;
  categories: Category[] = [];
  imageIds: number[] = [];
  isLoading = false;
  siteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private siteService: SiteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      location: ['', Validators.required],
      historicalSignificance: [''],
      expectedPopularity: ['Low', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadSiteData();
  }

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'text-success';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-danger';
      default:
        return 'text-muted';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-trending-flat';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }

  loadSiteData(): void {
    this.siteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.siteId) {
      this.isLoading = true;
      this.siteService.getById(this.siteId).subscribe({
        next: (site) => {
          this.siteForm.patchValue({
            name: site.name,
            categoryId: site.categoryId,
            location: site.location,
            historicalSignificance: site.historicalSignificance,
            expectedPopularity: site.expectedPopularity,
            description: site.description
          });
          
          this.imageIds = site.imageIds || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load site', err);
          this.showErrorAlert('Failed to load site data');
          this.isLoading = false;
        }
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  onImageIdsChange(ids: number[]): void {
    this.imageIds = ids;
  }

  onSubmit(): void {
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
      id: this.siteId || 0,
      imageIds: this.imageIds
    };

    const operation = this.siteId 
      ? this.siteService.update(siteData)
      : this.siteService.add(siteData);

    operation.subscribe({
      next: () => {
        const message = this.siteId 
          ? 'Site updated successfully!' 
          : 'Site added successfully!';
        this.showSuccessAlert(message).then(() => {
          this.router.navigate(['/sites/list']);
        });
      },
      error: (err) => {
        console.error('Error saving site', err);
        this.showErrorAlert('Failed to save site. Please try again.');
        this.isLoading = false;
      }
    });
  }

  showSuccessAlert(message: string): Promise<any> {
    return Swal.fire({
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

  showErrorAlert(message: string): void {
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