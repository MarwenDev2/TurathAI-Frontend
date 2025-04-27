import { Component } from '@angular/core';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { ProductInfoComponent } from './component/product-info/product-info.component';
import { ProductPricingComponent } from './component/product-pricing/product-pricing.component';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ProductDetailComponent,
    FileUploaderComponent,
    ProductInfoComponent,
    ProductPricingComponent,
  ],
  templateUrl: './edit.component.html',
  styles: ``,
})
export class EditComponent {
  title = 'PRODUCT EDIT';
}
