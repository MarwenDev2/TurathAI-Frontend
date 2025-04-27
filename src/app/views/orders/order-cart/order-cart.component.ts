import { Component, inject, type TemplateRef } from '@angular/core';
import { SummaryComponent } from './components/summary/summary.component';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '@core/services/toast-service';
import { ToastsContainer } from '@component/toasts-container.component';

@Component({
  selector: 'app-order-cart',
  standalone: true,
  imports: [CartListComponent, SummaryComponent, RouterLink, ToastsContainer],
  templateUrl: './order-cart.component.html',
  styles: ``,
})
export class OrderCartComponent {
  title = 'Order Cart';
  total: number = 0;

  toastService = inject(ToastService);

  showSuccess(template: TemplateRef<any>) {
    this.toastService.show({
      template,
      classname: 'bg-success text-light rounded-0 width-auto',
      delay: 10000,
    });
  }

  getTotal($event: number) {
    this.total = $event;
  }
}
