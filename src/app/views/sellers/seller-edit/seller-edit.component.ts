import { Component } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { SellerInformationComponent } from './components/seller-information/seller-information.component'
import { SellerProductInfoComponent } from './components/seller-product-info/seller-product-info.component'
import { SellerDetailComponent } from './components/seller-detail/seller-detail.component'

@Component({
  selector: 'app-seller-edit',
  standalone: true,
  imports: [SellerDetailComponent,FileUploaderComponent,SellerInformationComponent,SellerProductInfoComponent],
  templateUrl: './seller-edit.component.html',
  styles: ``,
})
export class SellerEditComponent {
  title = 'Seller Edit';
}
