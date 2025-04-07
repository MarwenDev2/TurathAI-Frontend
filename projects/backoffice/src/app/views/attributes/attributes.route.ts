import { Route } from '@angular/router'
import { AttributesListComponent } from './attributes-list/attributes-list.component'
import { AttributesEditComponent } from './attributes-edit/attributes-edit.component'
import { AttributesAddComponent } from './attributes-add/attributes-add.component'

export const ATTRIBUTES_ROUTES: Route[] = [
  {
    path: 'list',
    component: AttributesListComponent,
    data: { title: 'Attribute List' },
  },
  {
    path: 'edit',
    component: AttributesEditComponent,
    data: { title: 'Attribute Edit' },
  },
  {
    path: 'add',
    component: AttributesAddComponent,
    data: { title: 'Attribute Add' },
  }
]
