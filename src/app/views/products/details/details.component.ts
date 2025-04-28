import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { TopReviewComponent } from './components/top-review/top-review.component';
import { ProductInfoComponent } from './components/product-info/product-info.component';
import { FeatureComponent } from './components/feature/feature.component';
import { ProductImageComponent } from './components/product-image/product-image.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    ProductImageComponent,
    ItemDetailComponent,
    TopReviewComponent,
    ProductInfoComponent,
    FeatureComponent,
  ],
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  title = 'PRODUCT DETAILS';
}
