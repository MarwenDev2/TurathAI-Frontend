import { Route } from '@angular/router'
import { SellerListComponent } from './seller-list/seller-list.component'
import { SellerDetailsComponent } from './seller-details/seller-details.component'
import { SellerEditComponent } from './seller-edit/seller-edit.component'
import { SellerAddComponent } from './seller-add/seller-add.component'

export const SELLERS_ROUTES: Route[] = [
  {
    path: 'list',
    component: SellerListComponent,
    data: { title: 'Sellers List' },
  },
  {
    path: 'details',
    component: SellerDetailsComponent,
    data: { title: 'Seller Details' },
  },
  {
    path: 'edit',
    component: SellerEditComponent,
    data: { title: 'Seller Edit' },
  },
  {
    path: 'add',
    component: SellerAddComponent,
    data: { title: 'Seller Add' },
  }
]
