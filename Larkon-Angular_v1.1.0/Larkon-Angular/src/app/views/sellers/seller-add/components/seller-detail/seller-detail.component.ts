import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from '@common/constants';
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'add-seller-detail',
  standalone: true,
  imports: [NgbProgressbarModule,NgbDropdownModule],
  templateUrl: './seller-detail.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SellerDetailComponent {
  currency=currency
}
