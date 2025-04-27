import { Route } from '@angular/router'
import { ComingsoonComponent } from './comingsoon/comingsoon.component'
import { MaintenanceComponent } from './maintenance/maintenance.component'
import { Error404Component } from './error-404/error-404.component'


export const OTHER_PAGE_ROUTES: Route[] = [
  {
    path: 'comingsoon',
    component: ComingsoonComponent,
    data: { title: 'Coming Soon' },
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    data: { title: 'Maintenance' },
  },
  {
    path: '404',
    component: Error404Component,
    data: { title: 'Page Not Found - 404' },
  }
]
