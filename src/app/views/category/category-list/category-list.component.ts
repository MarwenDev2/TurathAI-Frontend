import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { categoryList } from '../data';
import { CategoriesComponent } from './components/categories/categories.component'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CategoriesComponent,NgbDropdownModule,NgbPaginationModule,RouterLink],
  templateUrl: './category-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryListComponent {
  title = 'CATEGORIES LIST';
  categoryData = categoryList;
}
