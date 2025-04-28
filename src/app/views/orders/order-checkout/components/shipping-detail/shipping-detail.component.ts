import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'checkout-shipping-detail',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './shipping-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShippingDetailComponent {
  currency=currency
}
