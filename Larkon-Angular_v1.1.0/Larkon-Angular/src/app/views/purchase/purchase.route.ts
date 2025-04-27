import { Route } from '@angular/router'
import { PurchaseListComponent } from './purchase-list/purchase-list.component'
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component'
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component'

export const PURCHASE_ROUTES: Route[] = [
  {
    path: 'list',
    component: PurchaseListComponent,
    data: { title: 'Purchase List' },
  },
  {
    path: 'order',
    component: PurchaseOrderComponent,
    data: { title: 'Purchase Order' },
  },
  {
    path: 'returns',
    component: PurchaseReturnsComponent,
    data: { title: 'Return List' },
  }
]
