import { Route } from '@angular/router'
import { InvoiceListComponent } from './invoice-list/invoice-list.component'
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component'
import { InvoiceAddComponent } from './invoice-add/invoice-add.component'

export const INVOICE_ROUTES: Route[] = [
  {
    path: 'list',
    component: InvoiceListComponent,
    data: { title: 'Invoices List' },
  },
  {
    path: 'details',
    component: InvoiceDetailsComponent,
    data: { title: 'Invoice Details' },
  },
  {
    path: 'add',
    component: InvoiceAddComponent,
    data: { title: 'Invoices Create' },
  }
]
