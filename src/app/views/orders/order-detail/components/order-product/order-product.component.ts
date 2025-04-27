import { Component } from '@angular/core';
import { orderProducts } from '../../data';
import { CommonModule, DecimalPipe } from '@angular/common'

@Component({
  selector: 'order-product',
  standalone: true,
  imports: [DecimalPipe,CommonModule],
  templateUrl: './order-product.component.html',
  styles: ``,
})
export class OrderProductComponent {
  productList = orderProducts;
}
