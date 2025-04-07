import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { GridComponent } from './grid/grid.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const PRODUCT_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Product List' },
  },
  {
    path: 'grid',
    component: GridComponent,
    data: { title: 'Product Grid' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Invoices List' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Product Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Product' },
  },
]
