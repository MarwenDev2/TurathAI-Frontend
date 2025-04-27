import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'

export const LOCAL_ROUTES: Route[] = [
  {
    path: 'list',
    component: ListComponent,
    data: { title: 'Local Insight List' },
  },
  {
    path: 'details',
    component: DetailsComponent,
    data: { title: 'Local Insight Details' },
  },
  {
    path: 'edit',
    component: EditComponent,
    data: { title: 'Local Insight Edit' },
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'Create Local Insight' },
  },
]
