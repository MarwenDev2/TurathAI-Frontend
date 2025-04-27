import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';

@Component({
  selector: 'order-summary',
  standalone: true,
  imports: [],
  templateUrl: './order-summary.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderSummaryComponent {
  currency=currency
}
