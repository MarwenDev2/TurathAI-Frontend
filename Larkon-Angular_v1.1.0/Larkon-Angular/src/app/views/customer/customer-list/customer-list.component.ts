import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomerStateComponent } from './components/customer-state/customer-state.component';
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { customerData } from './data';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CustomerStateComponent,
    NgbPaginationModule,
    NgbDropdownModule,
    DecimalPipe,
    CommonModule
  ],
  templateUrl: './customer-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerListComponent {
  title = 'Customer List';
  customerList = customerData;
}
