import { Component } from '@angular/core';
import { currency } from 'projects/backoffice/src/app/common/constants';

@Component({
  selector: 'edit-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styles: ``
})
export class ProductDetailComponent {
  currency=currency
}
