import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';

export const EVENT_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Event List' },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Event Details' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Event' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Event' },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];