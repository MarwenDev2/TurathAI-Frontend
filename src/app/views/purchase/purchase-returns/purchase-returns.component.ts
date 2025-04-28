import { CommonModule, DecimalPipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReturnStateComponent } from './component/return-state/return-state.component'
import { PurchaseReturnList } from './data'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-purchase-returns',
  standalone: true,
  imports: [CommonModule,ReturnStateComponent,DecimalPipe,NgbPaginationModule,NgbDropdownModule],
  templateUrl: './purchase-returns.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PurchaseReturnsComponent {
  title = 'Return List';
  returnList = PurchaseReturnList
}
