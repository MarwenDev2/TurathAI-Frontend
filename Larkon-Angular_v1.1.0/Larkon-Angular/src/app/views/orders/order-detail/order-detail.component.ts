import { Component } from '@angular/core';
import { OrderProgressComponent } from './components/order-progress/order-progress.component';
import { OrderProductComponent } from './components/order-product/order-product.component';
import { OrderTimelineComponent } from './components/order-timeline/order-timeline.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';
import { OrderStateComponent } from './components/order-state/order-state.component'

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    OrderProgressComponent,
    OrderProductComponent,
    OrderTimelineComponent,
    OrderSummaryComponent,
    CustomerDetailComponent,
    OrderPaymentComponent,
    OrderStateComponent
  ],
  templateUrl: './order-detail.component.html',
  styles: ``,
})
export class OrderDetailComponent {
  title = 'Order Details';
}
