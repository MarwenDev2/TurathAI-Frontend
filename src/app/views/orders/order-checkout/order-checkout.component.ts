import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { PersonalDetailComponent } from './components/personal-detail/personal-detail.component';
import { ShippingDetailComponent } from './components/shipping-detail/shipping-detail.component';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';
import { PromoCodeComponent } from './components/promo-code/promo-code.component';
import { SummaryComponent } from './components/summary/summary.component';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChecoutModalComponent } from './components/checout-modal/checout-modal.component';

@Component({
  selector: 'app-order-checkout',
  standalone: true,
  imports: [
    PersonalDetailComponent,
    ShippingDetailComponent,
    PaymentMethodComponent,
    PromoCodeComponent,
    SummaryComponent,
    RouterLink,
  ],
  templateUrl: './order-checkout.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderCheckoutComponent {
  title = 'Order Checkout';

  private modalService = inject(NgbModal);

  openModal() {
    this.modalService.open(ChecoutModalComponent);
  }
}
