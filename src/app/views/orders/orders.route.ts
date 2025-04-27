import { Route } from '@angular/router'
import { OrdersListComponent } from './orders-list/orders-list.component'
import { OrderDetailComponent } from './order-detail/order-detail.component'
import { OrderCartComponent } from './order-cart/order-cart.component'
import { OrderCheckoutComponent } from './order-checkout/order-checkout.component'

export const ORDER_ROUTES: Route[] = [
  {
    path: 'list',
    component: OrdersListComponent,
    data: { title: 'Orders List' },
  },
  {
    path: 'detail',
    component: OrderDetailComponent,
    data: { title: 'Order Details' },
  },
  {
    path: 'cart',
    component: OrderCartComponent,
    data: { title: 'Order Cart' },
  },
  {
    path: 'checkout',
    component: OrderCheckoutComponent,
    data: { title: 'Order Checkout' },
  },
]
