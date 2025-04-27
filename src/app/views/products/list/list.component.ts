import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductList } from '../data';
import { DecimalPipe } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router'
import { state2Data } from '../../apps/widgets/data'
import { WidgetState3Component } from '../../apps/widgets/components/widget-state3/widget-state3.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-list',
  standalone: true,
  imports: [DecimalPipe,NgbPaginationModule,NgbDropdownModule,RouterLink,WidgetState3Component ,CommonModule],
  templateUrl: './list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent {
  stateData = state2Data
  title = 'PRODUCT LIST';
  productData = ProductList;
}
