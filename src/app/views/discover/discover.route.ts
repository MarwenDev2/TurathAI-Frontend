import { Route } from '@angular/router'
import { ListComponent } from './Business/list/list.component'
import { DetailsComponent } from './Business/details/details.component'
import { EditComponent } from './Business/edit/edit.component'
import { AddComponent } from './Business/add/add.component'

export const DISCOVER_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Discover List' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Discover Details' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Discover Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Discover' },
  },
]
