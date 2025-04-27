import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductList } from '../data';
import { DecimalPipe } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [DecimalPipe,NgbPaginationModule,NgbDropdownModule,RouterLink],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {
  title = 'PRODUCT LIST';
  productData = ProductList;
}
