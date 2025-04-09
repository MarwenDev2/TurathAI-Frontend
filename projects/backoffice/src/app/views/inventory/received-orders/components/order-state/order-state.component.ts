import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { orderState } from '../../data';
import { StateCardComponent } from 'projects/backoffice/src/app/components/state-card/state-card.component';

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
