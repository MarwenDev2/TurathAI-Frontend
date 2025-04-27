import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const GAMMIFICATION_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Gammification List' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Gammification Details' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Gammification Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Gammification' },
  },
]
