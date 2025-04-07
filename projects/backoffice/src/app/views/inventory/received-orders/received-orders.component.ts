import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OrderStateComponent } from './components/order-state/order-state.component'
import { ReceivedOrderData } from './data'
import { CommonModule, DecimalPipe } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-received-orders',
  standalone: true,
  imports: [OrderStateComponent,CommonModule,DecimalPipe,NgbDropdownModule,NgbPaginationModule],
  templateUrl: './received-orders.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceivedOrdersComponent {
  title = "Received Orders"
  orderList = ReceivedOrderData
}
