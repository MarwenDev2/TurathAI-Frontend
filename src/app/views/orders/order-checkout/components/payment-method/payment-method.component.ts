import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'checkout-payment-method',
  standalone: true,
  imports: [NgbCollapseModule],
  templateUrl: './payment-method.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentMethodComponent {
  isCollapsed: boolean = true;
  isCollapsed1: boolean = false;
}
