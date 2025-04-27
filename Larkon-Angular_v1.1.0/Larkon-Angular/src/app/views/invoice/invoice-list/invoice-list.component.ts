import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { InvoiceStateComponent } from './components/invoice-state/invoice-state.component'
import { InvoiceData } from './data'

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbPaginationModule,
    InvoiceStateComponent,
  ],
  templateUrl: './invoice-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InvoiceListComponent {
  title = 'Invoices List';
  invoices = InvoiceData;
}
