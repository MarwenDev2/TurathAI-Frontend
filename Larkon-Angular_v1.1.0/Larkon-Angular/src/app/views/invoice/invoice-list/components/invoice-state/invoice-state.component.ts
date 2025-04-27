import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { invoiceState } from '../../data'
import { StateCardComponent } from '@component/state-card/state-card.component'

@Component({
  selector: 'invoice-state',
  standalone: true,
  imports: [StateCardComponent],
  templateUrl: './invoice-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceStateComponent {
  stateList = invoiceState
}
