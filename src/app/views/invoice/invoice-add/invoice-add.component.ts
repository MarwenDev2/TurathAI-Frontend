import { Component } from '@angular/core';
import { QuantityControlDirective } from '@core/directive/quantity-control.directive'

@Component({
  selector: 'app-invoice-add',
  standalone: true,
  imports: [QuantityControlDirective],
  templateUrl: './invoice-add.component.html',
  styles: ``,
})
export class InvoiceAddComponent {
  title = 'Invoices Create';
}
