import { Route } from '@angular/router'
import { ProfileComponent } from './profile/profile.component'
import { ReviewComponent } from './review/review.component'

export const PAGE_ROUTES: Route[] = [
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile' },
  },
  {
    path: 'review',
    component: ReviewComponent,
    data: { title: 'Reviews List' },
  },
]
