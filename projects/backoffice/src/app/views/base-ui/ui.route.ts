import { Route } from '@angular/router';
import { AccordionComponent } from './accordion/accordion.component'
import { AlertComponent } from './alert/alert.component';
import { AvatarsComponent } from './avatars/avatars.component';
import { BadgesComponent } from './badges/badges.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardComponent } from './card/card.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ListGroupComponent } from './list-group/list-group.component';
import { ModalComponent } from './modal/modal.component';
import { TabsComponent } from './tabs/tabs.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { PaginationComponent } from './pagination/pagination.component'
import { PlaceholdersComponent } from './placeholders/placeholders.component'
import { PopoversComponent } from './popovers/popovers.component'
import { ProgressComponent } from './progress/progress.component'
import { ScrollspyComponent } from './scrollspy/scrollspy.component'
import { SpinnersComponent } from './spinners/spinners.component'
import { ToastsComponent } from './toasts/toasts.component'
import { TooltipsComponent } from './tooltips/tooltips.component'

export const UI_ROUTES: Route[] = [
  {
    path: 'accordion',
    component: AccordionComponent,
    data: { title: 'Accordions' },
  },
  {
    path: 'alerts',
    component: AlertComponent,
    data: { title: 'Alerts' },
  },
  {
    path: 'avatar',
    component: AvatarsComponent,
    data: { title: 'Avatars' },
  },
  {
    path: 'badge',
    component: BadgesComponent,
    data: { title: 'Badges' },
  },
  {
    path: 'breadcrumb',
    component: BreadcrumbComponent,
    data: { title: 'Breadcrumb' },
  },
  {
    path: 'buttons',
    component: ButtonsComponent,
    data: { title: 'Buttons' },
  },
  {
    path: 'carousel',
    component: CarouselComponent,
    data: { title: 'Carousel' },
  },
  {
    path: 'card',
    component: CardComponent,
    data: { title: 'Card' },
  },
  {
    path: 'collapse',
    component: CollapseComponent,
    data: { title: 'Collapse' },
  },
  {
    path: 'dropdown',
    component: DropdownComponent,
    data: { title: 'Dropdown' },
  },
  {
    path: 'list-group',
    component: ListGroupComponent,
    data: { title: 'List Group' },
  },
  {
    path: 'modal',
    component: ModalComponent,
    data: { title: 'Modal' },
  },
  {
    path: 'tabs',
    component: TabsComponent,
    data: { title: 'Tabs' },
  },
  {
    path: 'offcanvas',
    component: OffcanvasComponent,
    data: { title: 'Offcanvas' },
  },
  {
    path: 'pagination',
    component: PaginationComponent,
    data: { title: 'Pagination' },
  },
  {
    path: 'placeholders',
    component: PlaceholdersComponent,
    data: { title: 'Placeholder' },
  },
  {
    path: 'popovers',
    component: PopoversComponent,
    data: { title: 'opovers' },
  },
  {
    path: 'progress',
    component: ProgressComponent,
    data: { title: 'Progress' },
  },
  {
    path: 'scrollspy',
    component: ScrollspyComponent,
    data: { title: 'Scrollspy' },
  },
  {
    path: 'spinners',
    component: SpinnersComponent,
    data: { title: 'Spinners' },
  },
  {
    path: 'toasts',
    component: ToastsComponent,
    data: { title: 'Toasts' },
  },
  {
    path: 'tooltips',
    component: TooltipsComponent,
    data: { title: 'Tooltips' },
  }
];
