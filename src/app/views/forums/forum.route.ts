import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';

export const FORUM_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Forum List' },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Forum Details' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Forum Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Forum' },
  },
];
