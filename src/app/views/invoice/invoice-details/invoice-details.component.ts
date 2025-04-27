import { Component } from '@angular/core';
import { invoiceProduct } from './data'
import { DecimalPipe } from '@angular/common'
import { currency } from '@common/constants';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './invoice-details.component.html',
  styles: ``,
})
export class InvoiceDetailsComponent {
  currency=currency
  title = 'Invoice Details';
  productList = invoiceProduct
}
