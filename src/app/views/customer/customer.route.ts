import { Route } from '@angular/router'
import { CustomerListComponent } from './customer-list/customer-list.component'
import { CustomerDetailComponent } from './customer-detail/customer-detail.component'

export const CUSTOMERS_ROUTES: Route[] = [
  {
    path: 'list',
    component: CustomerListComponent,
    data: { title: 'Customer List' },
  },
  {
    path: 'detail',
    component: CustomerDetailComponent,
    data: { title: 'Customer Details' },
  }
]
