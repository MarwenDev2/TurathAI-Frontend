import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const USER_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'User List' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'User Details' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'User Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create User' },
  },
]
