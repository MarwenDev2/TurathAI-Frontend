import { Route } from '@angular/router';
import { RatingsComponent } from './ratings/ratings.component'
import { SweetalertComponent } from './sweetalert/sweetalert.component'
import { SwiperSilderComponent } from './swiper-silder/swiper-silder.component'
import { ScrollbarComponent } from './scrollbar/scrollbar.component'
import { ToastifyComponent } from './toastify/toastify.component'

export const ADVANCED_ROUTES: Route[] = [
  {
    path: 'ratings',
    component: RatingsComponent,
    data: { title: 'Ratings' },
  },
  {
    path: 'sweetalert',
    component: SweetalertComponent,
    data: { title: 'Sweet Alert' },
  },
  {
    path: 'swiper-silder',
    component: SwiperSilderComponent,
    data: { title: 'Swiper Silder' },
  },
  {
    path: 'scrollbar',
    component: ScrollbarComponent,
    data: { title: 'Scrollbar' },
  },
  {
    path: 'toastify',
    component: ToastifyComponent,
    data: { title: 'Toastify' },
  },
];
