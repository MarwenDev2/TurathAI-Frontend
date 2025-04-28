import { Route } from '@angular/router'
import { CategoryListComponent } from './category-list/category-list.component'
import { CategoryEditComponent } from './category-edit/category-edit.component'
import { CategoryAddComponent } from './category-add/category-add.component'

export const CATEGORY_ROUTES: Route[] = [
  {
    path: 'list',
    component: CategoryListComponent,
    data: { title: 'Categories List' },
  },
  {
    path: 'edit',
    component: CategoryEditComponent,
    data: { title: 'Category Edit' },
  },
  {
    path: 'add',
    component: CategoryAddComponent,
    data: { title: 'Create Category' },
  },
]
