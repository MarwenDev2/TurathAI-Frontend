import { Route } from '@angular/router'
import { GoogleComponent } from './google/google.component'
import { VectorComponent } from './vector/vector.component'

export const MAPS_ROUTES: Route[] = [
  {
    path: 'google',
    component: GoogleComponent,
    data: { title: 'Google Maps' },
  },
  {
    path: 'vector',
    component: VectorComponent,
    data: { title: 'Vector Maps' },
  }
]