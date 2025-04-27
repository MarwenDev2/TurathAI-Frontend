import { Route } from '@angular/router'
import { RoleListComponent } from './role-list/role-list.component'
import { RoleEditComponent } from './role-edit/role-edit.component'
import { RoleAddComponent } from './role-add/role-add.component'

export const ROLE_ROUTES: Route[] = [
  {
    path: 'list',
    component: RoleListComponent,
    data: { title: 'Roles List' },
  },
  {
    path: 'edit',
    component: RoleEditComponent,
    data: { title: 'Role Edit' },
  },
  {
    path: 'add',
    component: RoleAddComponent,
    data: { title: 'Role Add' },
  }
]
