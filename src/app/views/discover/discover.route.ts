import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

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
