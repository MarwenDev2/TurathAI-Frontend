import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';

export const BUSINESS_ROUTES: Routes = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Business List' },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Business Details' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Edit Business' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Add Business' },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];
