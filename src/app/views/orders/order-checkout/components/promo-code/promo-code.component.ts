import { Component, inject, type TemplateRef } from '@angular/core';
import { ToastsContainer } from '@component/toasts-container.component'
import { ToastService } from '@core/services/toast-service'

@Component({
  selector: 'checkout-promo-code',
  standalone: true,
  imports: [ToastsContainer],
  templateUrl: './promo-code.component.html',
  styles: ``
})
export class PromoCodeComponent {

  toastService = inject(ToastService);

	showSuccess(template: TemplateRef<any>) {
		this.toastService.show({ template, classname: 'bg-success text-light rounded-0 width-auto', delay: 10000 });
	}
}
