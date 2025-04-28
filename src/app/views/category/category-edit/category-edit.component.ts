import { Component } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { GeneralInfoComponent } from './components/general-info/general-info.component'
import { MetaOptionComponent } from './components/meta-option/meta-option.component'

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [FileUploaderComponent,GeneralInfoComponent,MetaOptionComponent],
  templateUrl: './category-edit.component.html',
  styles: ``,
})
export class CategoryEditComponent {
  title = 'Category Edit';
}
