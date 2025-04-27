import { Route } from '@angular/router'
import { UserPreferencesComponent } from './user-preferences.component'
import { AddComponent } from './add/add.component'
import { EditComponent } from './edit/edit.component'

export const USERPREFERENCES_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: UserPreferencesComponent },
  { path: 'add', component: AddComponent },
  { path: 'edit', component: EditComponent}
]
