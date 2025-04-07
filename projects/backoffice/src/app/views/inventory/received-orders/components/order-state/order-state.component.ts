import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StateCardComponent } from '@component/state-card/state-card.component';
import { orderState } from '../../data';

@Component({
  selector: 'received-order-state',
  standalone: true,
  imports: [StateCardComponent],
  templateUrl: './order-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrderStateComponent {
  stateList = orderState;
}
