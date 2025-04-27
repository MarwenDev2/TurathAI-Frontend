import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';

@Component({
  selector: 'customer-state',
  standalone: true,
  imports: [],
  templateUrl: './customer-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomerStateComponent {
  currency=currency
}
