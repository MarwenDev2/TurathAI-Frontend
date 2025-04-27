import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'coupon-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './coupon-info.component.html',
  styles: ``
})
export class CouponInfoComponent {

}
