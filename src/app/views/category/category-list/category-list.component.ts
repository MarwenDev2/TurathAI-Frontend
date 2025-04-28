import { Component, CUSTOM_ELEMENTS_SCHEMA , OnInit } from '@angular/core';
import { CategoriesComponent } from './components/categories/categories.component'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router';
import { Category } from '@core/Models/category';
import { CommonModule } from '@angular/common';
import { CategoryService } from '@core/services/category.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CategoriesComponent,NgbDropdownModule,NgbPaginationModule,RouterLink ,CommonModule],
  templateUrl: './category-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryListComponent implements OnInit {
  title = 'CATEGORIES LIST';
  categories: Category[] = [];
  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories = data;
    });
  }
  deleteCategory(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(id).subscribe(() => {
          this.loadData();
          Swal.fire('Deleted!', 'Your category has been deleted.', 'success');
        });
      }
    });
  }
deleteSite(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-danger w-xs mt-2',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.categories = this.categories.filter((s) => s.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'The site has been deleted.',
              icon: 'success',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete the site.',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-primary w-xs mt-2',
              },
              buttonsStyling: false,
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          text: 'The site is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2',
          },
          buttonsStyling: false,
        });
      }
    });
  }
}
