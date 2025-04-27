import { Route } from '@angular/router'
import { ProfileComponent } from './profile/profile.component'
import { PermissionsComponent } from './permissions/permissions.component'
import { ReviewComponent } from './review/review.component'
import { FaqsComponent } from './faqs/faqs.component'
import { StarterComponent } from './starter/starter.component'
import { TimelineComponent } from './timeline/timeline.component'
import { PricingComponent } from './pricing/pricing.component'
import { Error404AltComponent } from './error-404-alt/error-404-alt.component'
import { SettingsComponent } from './settings/settings.component'
import { HelpCenterComponent } from './help-center/help-center.component'
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component'

export const PAGE_ROUTES: Route[] = [
  {
    path: 'profile',
    component: ProfileComponent,
    data: { title: 'Profile' },
  },
  {
    path: 'permissions',
    component: PermissionsComponent,
    data: { title: 'Permissions' },
  },
  {
    path: 'review',
    component: ReviewComponent,
    data: { title: 'Reviews List' },
  },
  {
    path: 'faqs',
    component: FaqsComponent,
    data: { title: 'FAQs' },
  },
  {
    path: 'starter',
    component: StarterComponent,
    data: { title: 'Welcome' },
  },
  {
    path: 'timeline',
    component: TimelineComponent,
    data: { title: 'Timeline' },
  },
  {
    path: 'pricing',
    component: PricingComponent,
    data: { title: 'Pricing' },
  },
  {
    path: '404-alt',
    component: Error404AltComponent,
    data: { title: '404' },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: { title: 'Settings' },
  },
  {
    path: 'help-center',
    component: HelpCenterComponent,
    data: { title: 'Help Center' },
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: { title: 'Privacy Policy' },
  }
]
