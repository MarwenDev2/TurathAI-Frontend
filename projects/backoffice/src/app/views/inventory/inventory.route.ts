import { Route } from '@angular/router'
import { ReceivedOrdersComponent } from './received-orders/received-orders.component'
import { WarehouseComponent } from './warehouse/warehouse.component'

export const INVENTORY_ROUTES: Route[] = [
  {
    path: 'warehouse',
    component: WarehouseComponent,
    data: { title: 'Warehouse List' },
  },
  {
    path: 'received-order',
    component: ReceivedOrdersComponent,
    data: { title: 'Received Orders' },
  }
]
