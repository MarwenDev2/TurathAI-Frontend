import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const VIEW_ROUTES: Route[] = [

  {
    path: 'index',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./users/user.route').then((mod) => mod.USER_ROUTES),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./products/product.route').then((mod) => mod.PRODUCT_ROUTES),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.route').then((mod) => mod.INVENTORY_ROUTES),
  },
  {
    path: 'attributes',
    loadChildren: () =>
      import('./attributes/attributes.route').then((mod) => mod.ATTRIBUTES_ROUTES),
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
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGE_ROUTES),
  },
];
