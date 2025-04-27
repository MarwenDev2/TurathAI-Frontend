import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const SITE_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Site List' },
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    data: { title: 'Site Details' },
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    data: { title: 'Site Edit' },
  },

  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Site' },
  },
]
