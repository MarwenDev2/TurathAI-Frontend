import { Component } from '@angular/core';
import { FileUploaderComponent } from '@component/file-uploader/file-uploader.component'
import { GeneralInfoComponent } from './components/general-info/general-info.component'
import { MetaOptionComponent } from './components/meta-option/meta-option.component'

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [FileUploaderComponent,GeneralInfoComponent,MetaOptionComponent],
  templateUrl: './category-add.component.html',
  styles: ``,
})
export class CategoryAddComponent {
  title = 'Create Category';
}
