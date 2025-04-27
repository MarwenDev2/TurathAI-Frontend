import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core'
import { provideRouter } from '@angular/router'

import { DecimalPipe } from '@angular/common'
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideEffects } from '@ngrx/effects'
import { provideStore } from '@ngrx/store'
import { provideStoreDevtools } from '@ngrx/store-devtools'
import { provideToastr } from 'ngx-toastr'
import { routes } from './app.routes'
import { FakeBackendProvider } from './helper/fake-backend'
import { AuthInterceptor } from '@core/AuthInterceptor'

// Social Login imports
import { SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login'
import { socialAuthServiceConfig } from './core/config/social-auth.config'

export const appConfig: ApplicationConfig = {
  providers: [
    FakeBackendProvider,
    DecimalPipe,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    importProvidersFrom(BrowserAnimationsModule, BrowserModule, SocialLoginModule),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideToastr({}),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: socialAuthServiceConfig
    }
  ],
}
