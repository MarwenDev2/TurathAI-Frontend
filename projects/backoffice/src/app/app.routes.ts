import { Routes, Router, type UrlTree, RedirectCommand } from '@angular/router'
import { LayoutComponent } from './layouts/layout/layout.component'
import { AuthenticationService } from './core/services/auth.service'
import { inject } from '@angular/core'
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [
      (url: any) => {
        const router = inject(Router)
        const currentUser = inject(AuthenticationService)
        if (!currentUser.session) {
          return router.createUrlTree(['/auth/signin'], {
            queryParams: { returnUrl: url._routerState.url },
          })
        }
        return true
      },
    ],
    loadChildren: () =>
      import('./views/views.route').then((mod) => mod.VIEW_ROUTES),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES),
  },
]
