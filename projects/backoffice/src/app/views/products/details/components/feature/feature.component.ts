import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { currency } from 'projects/backoffice/src/app/common/constants';

@Component({
  selector: 'detail-feature',
  standalone: true,
  imports: [],
  templateUrl: './feature.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeatureComponent {
  currency=currency
}
