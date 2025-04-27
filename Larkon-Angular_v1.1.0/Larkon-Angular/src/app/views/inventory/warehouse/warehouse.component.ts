import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { inventoryState, warehouseList } from './data'
import { DecimalPipe } from '@angular/common'
import { StateCardComponent } from '@component/state-card/state-card.component'

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [StateCardComponent,NgbDropdownModule,DecimalPipe,NgbPaginationModule],
  templateUrl: './warehouse.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WarehouseComponent {
  title="WareHouse List"
  warehouses = warehouseList
  stateList = inventoryState;
}
