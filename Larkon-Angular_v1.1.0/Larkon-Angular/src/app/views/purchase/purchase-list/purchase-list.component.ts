import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { purchaseData } from './data';
import { CommonModule } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule,NgbPaginationModule,NgbDropdownModule],
  templateUrl: './purchase-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PurchaseListComponent {
  title = 'Purchase List';

  purchaseList = purchaseData;
}
