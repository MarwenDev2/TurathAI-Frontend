// src/app/views/reviews/review.route.ts
import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';

export const REVIEW_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Review List' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Review' },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];