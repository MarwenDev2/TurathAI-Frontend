import { Route } from '@angular/router'
import { BoxiconsComponent } from './boxicons/boxicons.component'
import { SolarComponent } from './solar/solar.component'

export const ICONS_ROUTES: Route[] = [
  {
    path: 'boxicons',
    component: BoxiconsComponent,
    data: { title: 'Boxicons' },
  },
  {
    path: 'solar',
    component: SolarComponent,
    data: { title: 'Solar Icons' },
  }
]
