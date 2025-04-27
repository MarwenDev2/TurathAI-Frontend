import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const ITENARY_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Itenary List' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Itenary Details' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Itenary Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Itenary' },
  },
]
