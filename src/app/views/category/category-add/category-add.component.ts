import { Component , OnInit } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { GeneralInfoComponent } from './components/general-info/general-info.component'
import { MetaOptionComponent } from './components/meta-option/meta-option.component'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '@core/Models/category';
import { CategoryService } from '@core/services/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [FileUploaderComponent,GeneralInfoComponent,MetaOptionComponent,CommonModule,ReactiveFormsModule],
  templateUrl: './category-add.component.html',
  styles: ``,
})
export class CategoryAddComponent  {
  title = 'Create Category';
  categoryForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Form values:', this.categoryForm.value);
    console.log('Form valid:', this.categoryForm.valid);
      if (this.categoryForm.invalid) {
        this.showErrorAlert('Please fill all required fields');
        return;
      }
  
  
      this.isLoading = true;
      
      const categoryData: Category = {
        ...this.categoryForm.value
      };
  
      this.categoryService.add(categoryData)
        .subscribe({
          next: () => {
            this.showSuccessAlert('Category added successfully!');
            this.resetForm();
            this.router.navigate(['/category/category-list']); // Adjust the route as needed
          },
          error: (err) => {
            console.error('Error adding category', err);
            this.showErrorAlert('Failed to add category. Please try again.');
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  
    resetForm() {
      this.categoryForm.reset({
        name: ''
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
