import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItineraryStatisticsComponent } from './itinerary-statistics/itinerary-statistics.component';

export const VIEW_ROUTES: Route[] = [

  {
    path: 'index',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },

  {
    path: 'product',
    loadChildren: () =>
      import('./products/product.route').then((mod) => mod.PRODUCT_ROUTES),
  },

              /////////////// MANAGEMENT ROUTES ///////////////
  {
    path: 'users',
    loadChildren: () =>
      import('./users/user.route').then((mod) => mod.USER_ROUTES),
  },

  {
    path: 'sites',
    loadChildren: () =>
      import('./sites/site.route').then((mod) => mod.SITE_ROUTES),
  },

  {
    path: 'local-insight',
    loadChildren: () =>
      import('./local-insight/local-insight.route').then((mod) => mod.LOCAL_ROUTES),
  },


  {
    path: 'itenary',
    loadChildren: () =>
      import('./itenary/itenary.route').then((mod) => mod.ITENARY_ROUTES),
  },

  {
    path: 'stop-management/:id',
    loadComponent: () => import('./stop-management/stop-management.component')
      .then(m => m.StopManagementComponent),
    data: { title: 'Stop Management' }
  },

  {
    path: 'itinerary-statistics',
    component: ItineraryStatisticsComponent,
    data: { title: 'Itinerary Statistics' }
  },

  {
    path: 'gammification',
    loadChildren: () =>
      import('./gammification/gammification.route').then((mod) => mod.GAMMIFICATION_ROUTES),
  },

  {
    path: 'forums',
    loadChildren: () =>
      import('./forums/forum.route').then((mod) => mod.FORUM_ROUTES),
  },


  {
    path: 'discover',
    loadChildren: () =>
      import('./discover/discover.route').then((mod) => mod.DISCOVER_ROUTES),
  },

  

  







  {
    path: 'category',
    loadChildren: () =>
      import('./category/category.route').then((mod) => mod.CATEGORY_ROUTES),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.route').then((mod) => mod.INVENTORY_ROUTES),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./orders/orders.route').then((mod) => mod.ORDER_ROUTES),
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('./purchase/purchase.route').then((mod) => mod.PURCHASE_ROUTES),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./attributes/attributes.route').then((mod) => mod.ATTRIBUTES_ROUTES),
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('./invoice/invoice.route').then((mod) => mod.INVOICE_ROUTES),
  },
  {
    path: 'role',
    loadChildren: () =>
      import('./roles/role.route').then((mod) => mod.ROLE_ROUTES),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.route').then((mod) => mod.CUSTOMERS_ROUTES),
  },
  {
    path: 'seller',
    loadChildren: () =>
      import('./sellers/sellers.route').then((mod) => mod.SELLERS_ROUTES),
  },
  {
    path: 'coupons',
    loadChildren: () =>
      import('./coupons/coupons.route').then((mod) => mod.COUPON_ROUTES),
  },
  {
    path: 'apps',
    loadChildren: () =>
      import('./apps/apps.route').then((mod) => mod.APPS_ROUTES),
  },
  {
    path: 'ui',
    loadChildren: () =>
      import('./base-ui/ui.route').then((mod) => mod.UI_ROUTES),
  },
  {
    path: 'extended',
    loadChildren: () =>
      import('./advance-ui/advance-ui.route').then((mod) => mod.ADVANCED_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.route').then((mod) => mod.CHART_ROUTES),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.route').then((mod) => mod.FORMS_ROUTES),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/tables.route').then((mod) => mod.TABLES_ROUTES),
  },
  {
    path: 'icons',
    loadChildren: () =>
      import('./icons/icons.route').then((mod) => mod.ICONS_ROUTES),
  },
  {
    path: 'maps',
    loadChildren: () =>
      import('./maps/maps.route').then((mod) => mod.MAPS_ROUTES),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGE_ROUTES),
  },
];
