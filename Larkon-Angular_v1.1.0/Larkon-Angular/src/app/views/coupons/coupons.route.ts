import { Route } from '@angular/router'
import { CouponsListComponent } from './coupons-list/coupons-list.component'
import { CouponsAddComponent } from './coupons-add/coupons-add.component'

export const COUPON_ROUTES: Route[] = [
  {
    path: 'list',
    component: CouponsListComponent,
    data: { title: 'Coupons List' },
  },
  {
    path: 'add',
    component: CouponsAddComponent,
    data: { title: 'Coupons Add' },
  }
]
