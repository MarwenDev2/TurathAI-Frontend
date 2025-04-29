import { Route } from '@angular/router'
import { ListComponent } from './list/list.component'
import { DetailsComponent } from './details/details.component'
import { EditComponent } from './edit/edit.component'
import { AddComponent } from './add/add.component'
import { ItenaryComponent } from './itenary.component'

export const ITENARY_ROUTES: Route[] = [
  {
    path: '',
    component: ItenaryComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: ListComponent,
        data: { title: 'Itenary List' },
      },
      {
        path: 'details/:id',
        component: DetailsComponent,
        data: { title: 'Itenary Details' },
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        data: { title: 'Itenary Edit' },
      },
      {
        path: 'add',
        component: AddComponent,
        data: { title: 'Create Itenary' },
      }
    ]
  }
]
