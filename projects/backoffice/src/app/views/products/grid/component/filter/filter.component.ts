import { Component } from '@angular/core';
import {
  NgbAccordionModule,
  NgbCollapseModule,
} from '@ng-bootstrap/ng-bootstrap';
import { currency } from 'projects/backoffice/src/app/common/constants';

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
