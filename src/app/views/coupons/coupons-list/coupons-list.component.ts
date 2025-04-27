import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CouponStateComponent } from './components/coupon-state/coupon-state.component';
import { CouponData } from './data';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule, DecimalPipe } from '@angular/common'

@Component({
  selector: 'app-coupons-list',
  standalone: true,
  imports: [CouponStateComponent,NgbPaginationModule,NgbDropdownModule,CommonModule,DecimalPipe],
  templateUrl: './coupons-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CouponsListComponent {
  title = 'Coupons';

  couponList = CouponData;
}
