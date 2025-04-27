import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  Output,
  type OnInit,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { QuantityControlDirective } from '@core/directive/quantity-control.directive';
import { CartType, cartData } from '@views/orders/data';
import { currency } from '@common/constants'

@Component({
  selector: 'cart-list',
  standalone: true,
  imports: [DecimalPipe, QuantityControlDirective],
  templateUrl: './cart-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartListComponent implements OnInit {
  cartList: CartType[] = cartData;
  currency = currency
  subTotal: number = 0;
  @Output() totalEvent = new EventEmitter<number>();

  ngOnInit(): void {
    this.calculatePrice()
  }

  calculateTotal(qty: number, item: CartType) {
    const total = item.item_price * qty + item.tax;
    item.total = total;
    this.calculatePrice();
  }

  // Calculate price
  calculatePrice() {
    this.subTotal = 0;
    this.cartList.forEach((element) => {
      this.subTotal += element.total;
    });
    this.totalEvent.emit(this.subTotal);
  }
}
