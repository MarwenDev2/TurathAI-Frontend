import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderList } from '../data';
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { OrderStatusComponent } from './components/order-status/order-status.component'

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule,DecimalPipe,NgbDropdownModule,NgbPaginationModule,OrderStatusComponent],
  templateUrl: './orders-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersListComponent {
  title = 'Orders List';
  orders = OrderList;
}
