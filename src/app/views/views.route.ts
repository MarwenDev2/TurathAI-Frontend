import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ItineraryStatisticsComponent } from './itinerary-statistics/itinerary-statistics.component';

export const VIEW_ROUTES: Route[] = [

  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./users/user.route').then((mod) => mod.USER_ROUTES),
  },
  {
    path: 'userPreference',
    loadChildren: () =>
      import('./userPreferences/userPreferences.route').then((mod) => mod.USERPREFERENCES_ROUTES),
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
    path: 'event',
    loadChildren: () =>
      import('./discover/event/event.routes').then((mod) => mod.EVENT_ROUTES),
  },
  {
    path: 'businesses',
    loadChildren: () =>
      import('./discover/Business/business.routes').then((mod) => mod.BUSINESS_ROUTES),
  },
  {
    path: 'forums',
    loadChildren: () =>
      import('./forums/forum.route').then((mod) => mod.FORUM_ROUTES),
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.route').then((mod) => mod.REVIEW_ROUTES),
  },
  {
    path: 'wishlist',
    loadChildren: () => import('./whishlist/wishlist.route').then((mod) => mod.WISHLIST_ROUTES),
  },

  {
    path: 'discover',
    loadChildren: () =>
      import('./discover/discover.route').then((mod) => mod.DISCOVER_ROUTES),
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
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.route').then((mod) => mod.PAGE_ROUTES),
  },

  {
    path: 'product',
    loadChildren: () =>
      import('./products/product.route').then((mod) => mod.PRODUCT_ROUTES),
  },
];
