import { DecimalPipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  type OnChanges,
  type OnInit,
  type SimpleChanges,
} from '@angular/core';
import { currency } from '@common/constants'

@Component({
  selector: 'cart-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './summary.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SummaryComponent implements OnInit, OnChanges {
  
  @Input() total: number = 0;

  currency = currency
  totalAmount: number = 0;
  discount: number = 60;
  tax: number = 20;

  ngOnInit(): void {
    this.totalAmount = this.total - this.discount + this.tax;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['total']) {
      this.calculateTotalAmount();
    }
  }

  private calculateTotalAmount(): void {
    this.totalAmount = this.total - this.discount + this.tax;
  }
}
