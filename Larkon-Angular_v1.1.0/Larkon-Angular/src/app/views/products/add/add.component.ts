import { Component } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { DetailComponent } from './components/detail/detail.component'
import { InfoComponent } from './components/info/info.component'
import { PricingComponent } from './components/pricing/pricing.component'

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FileUploaderComponent,DetailComponent,InfoComponent,PricingComponent],
  templateUrl: './add.component.html',
  styles: ``,
})
export class AddComponent {
  title = 'CREATE PRODUCT';
}
