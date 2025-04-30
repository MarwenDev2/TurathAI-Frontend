import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';

export const FORUMS_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Forums' },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Forum Details' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Forum' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Forum' },
  },
];
