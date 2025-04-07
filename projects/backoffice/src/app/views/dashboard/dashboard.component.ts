import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StateComponent } from './components/state/state.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { ConversionsComponent } from './components/conversions/conversions.component';
import { SessionsCountryComponent } from './components/sessions-country/sessions-country.component';
import { TopPagesComponent } from './components/top-pages/top-pages.component';
import { RecentOrderComponent } from './components/recent-order/recent-order.component';
import { ReceivedOrdersComponent } from "../inventory/received-orders/received-orders.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    StateComponent,
    PerformanceComponent,
    ConversionsComponent,
    SessionsCountryComponent,
    TopPagesComponent,
    RecentOrderComponent,
    ReceivedOrdersComponent
],
  templateUrl: './dashboard.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
  title = 'WELCOME!';
}
