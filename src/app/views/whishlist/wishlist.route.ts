// src/app/views/wishlist/wishlist.route.ts
import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';

import { AddComponent } from './add/add.component';

export const WISHLIST_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Wishlist' },
  },
  
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add to Wishlist' },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];