import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { sellerData } from './data';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ToAlphaNumberPipe } from '@core/to-alpha-number.pipe'
import { DecimalPipe } from '@angular/common'

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [NgbDropdownModule, NgbProgressbarModule,ToAlphaNumberPipe,DecimalPipe],
  templateUrl: './seller-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SellerListComponent {
  title = 'Sellers List';
  sellerList = sellerData;
}
