import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { currency } from 'projects/backoffice/src/app/common/constants';
import { QuantityControlDirective } from 'projects/backoffice/src/app/core/directive/quantity-control.directive';

@Component({
  selector: 'detail-product-info',
  standalone: true,
  imports: [QuantityControlDirective,NgbRatingModule],
  templateUrl: './product-info.component.html',
  styles: ``
})
export class ProductInfoComponent {
  currency=currency
}
