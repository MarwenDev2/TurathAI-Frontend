import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { purchaseState } from '../../data'
import { StateCardComponent } from '@component/state-card/state-card.component'

@Component({
  selector: 'purchase-state',
  standalone: true,
  imports: [StateCardComponent],
  templateUrl: './purchase-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PurchaseStateComponent {
  stateList = purchaseState
}
