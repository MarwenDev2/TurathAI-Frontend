import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StateCardComponent } from '@component/state-card/state-card.component'
import { StatusData } from '@views/orders/data';

@Component({
  selector: 'order-status',
  standalone: true,
  imports: [StateCardComponent],
  templateUrl: './order-status.component.html',
})
export class OrderStatusComponent {
  stateList = StatusData;
}
