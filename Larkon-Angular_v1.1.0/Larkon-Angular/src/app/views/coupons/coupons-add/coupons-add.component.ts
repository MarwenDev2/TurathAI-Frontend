import { Component } from '@angular/core';
import { CouponInfoComponent } from './components/coupon-info/coupon-info.component'
import { FlatpickrDirective } from '@core/directive/flatpickr.directive'

@Component({
  selector: 'app-coupons-add',
  standalone: true,
  imports: [CouponInfoComponent,FlatpickrDirective],
  templateUrl: './coupons-add.component.html',
  styles: ``,
})
export class CouponsAddComponent {
  title = 'Coupons Add';
}
