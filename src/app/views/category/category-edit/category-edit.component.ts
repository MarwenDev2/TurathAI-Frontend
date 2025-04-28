import { Component, OnInit } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { MetaOptionComponent } from './components/meta-option/meta-option.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '@core/Models/category';
import { CategoryService } from '@core/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploaderComponent,
    GeneralInfoComponent,
    MetaOptionComponent
  ],
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent implements OnInit {
  title = 'Edit Category'; // Changed from 'Create Category'
  categoryForm: FormGroup;
  isLoading = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoryId = +id;
        this.isLoading = true;
        this.categoryService.getById(this.categoryId).subscribe({
          next: (category) => {
            this.categoryForm.patchValue({
              name: category.name,
            });
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load category', err);
            this.isLoading = false;
            this.showErrorAlert('Failed to load category data');
          }
        });
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    this.isLoading = true;
    
    const categoryData: Category = {
      ...this.categoryForm.value,
      id: this.categoryId || 0
    };

    this.categoryService.update(categoryData).subscribe({
      next: () => {
        this.showSuccessAlert('Category updated successfully!');
        this.router.navigate(['/category/list']);
      },
      error: (err) => {
        console.error('Error updating category', err);
        this.showErrorAlert('Failed to update category. Please try again.');
        this.isLoading = false;
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
}  
  
      
  