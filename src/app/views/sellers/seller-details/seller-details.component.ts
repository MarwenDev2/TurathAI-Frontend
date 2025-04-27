import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LatestProductComponent } from './components/latest-product/latest-product.component';
import { AccountingComponent } from './components/accounting/accounting.component';
import { CompanyReviewComponent } from './components/company-review/company-review.component';
import { SalesAnalyticComponent } from './components/sales-analytic/sales-analytic.component';
import { SellerProfitComponent } from './components/seller-profit/seller-profit.component';
import { SellerInfoComponent } from './components/seller-info/seller-info.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-seller-details',
  standalone: true,
  imports: [
    SellerInfoComponent,
    SellerProfitComponent,
    SalesAnalyticComponent,
    CompanyReviewComponent,
    LatestProductComponent,
    AccountingComponent,
    NgbRatingModule
  ],
  templateUrl: './seller-details.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SellerDetailsComponent {
  title = 'Seller Details';
}
