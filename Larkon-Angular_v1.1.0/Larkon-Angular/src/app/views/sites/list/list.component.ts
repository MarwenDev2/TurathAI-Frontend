import { Component,CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { state2Data } from '../../apps/widgets/data';
import { WidgetState3Component } from '../../apps/widgets/components/widget-state3/widget-state3.component';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/Models/category';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    DecimalPipe,
    NgbPaginationModule,
    NgbDropdownModule,
    RouterLink,
    WidgetState3Component,
    CommonModule
  ],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  stateData = state2Data;
  title = 'SITE LIST';
  sites: Site[] = [];
  categoriesMap = new Map<number, string>();

  constructor(
    private siteService: SiteService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));
      
      this.siteService.getAll().subscribe((data) => {
        this.sites = data;
      });
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || 'Unknown';
  }

  getImageUrls(imageIds: number[]): string[] {
    if (!imageIds || imageIds.length === 0) {
      return ['assets/images/qr-code.png'];
    }
    return imageIds.map(id => `http://localhost:9090/images/${id}`);
  }

  getFirstImageUrl(imageIds: number[]): string {
    const urls = this.getImageUrls(imageIds);
    return urls[0];
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
        this.siteService.delete(id).subscribe({
          next: () => {
            this.sites = this.sites.filter((s) => s.id !== id);
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