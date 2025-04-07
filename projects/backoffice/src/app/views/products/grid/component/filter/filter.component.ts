import { Component } from '@angular/core';
import { currency } from '@common/constants';
import {
  NgbAccordionModule,
  NgbCollapseModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'grid-filter',
  standalone: true,
  imports: [NgbCollapseModule],
  templateUrl: './filter.component.html',
  styles: ``,
})
export class FilterComponent {
  currency=currency
  isCollapsed = false;
  priceCollapsed = false;
  genderCollapsed = false;
  sizeCollapsed = false;
  ratingCollapsed = false;
}
