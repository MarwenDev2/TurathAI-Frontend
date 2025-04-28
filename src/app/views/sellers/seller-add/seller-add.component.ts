import { Component } from '@angular/core';
import { SellerDetailComponent } from './components/seller-detail/seller-detail.component'
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { SellerInformationComponent } from './components/seller-information/seller-information.component'
import { SellerProductInfoComponent } from './components/seller-product-info/seller-product-info.component'

@Component({
  selector: 'app-seller-add',
  standalone: true,
  imports: [SellerDetailComponent,FileUploaderComponent,SellerInformationComponent,SellerProductInfoComponent],
  templateUrl: './seller-add.component.html',
  styles: ``
})
export class SellerAddComponent {
  title="Seller Add"
}
