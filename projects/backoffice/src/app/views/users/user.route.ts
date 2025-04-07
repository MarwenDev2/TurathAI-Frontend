import { Route } from '@angular/router'
import { UsersListComponent } from './list/list.component'
import { AddComponent } from './add/add.component'
import { EditComponent } from './edit/edit.component'

export const USER_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: UsersListComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit', component: EditComponent}
]
