import { Component } from '@angular/core';
import { DetailComponent } from './components/detail/detail.component'
import { InfoComponent } from './components/info/info.component'
import { PricingComponent } from './components/pricing/pricing.component'
import { FileUploaderComponent } from '../../../components/file-uploader/file-uploader.component';

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
