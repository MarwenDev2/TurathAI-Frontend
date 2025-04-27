import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PurchaseStateComponent } from './component/purchase-state/purchase-state.component';
import { purchaseOrders } from './data';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-purchase-order',
  standalone: true,
  imports: [PurchaseStateComponent, DecimalPipe, CommonModule,NgbPaginationModule,NgbDropdownModule],
  templateUrl: './purchase-order.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PurchaseOrderComponent {
  title = 'Purchase Order';
  orderList = purchaseOrders;
}
