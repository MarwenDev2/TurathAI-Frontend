import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { orderList } from '@views/dashboard/data';

@Component({
  selector: 'dashboard-recent-order',
  standalone: true,
  imports: [CommonModule, NgbPaginationModule,RouterLink],
  templateUrl: './recent-order.component.html',
  styles: ``,
})
export class RecentOrderComponent {
  orders = orderList;
}
