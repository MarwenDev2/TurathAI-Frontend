import { Component, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  NgbActiveOffcanvas,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap'
import { QuillModule } from 'ngx-quill'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [QuillModule, FormsModule, SimplebarAngularModule, NgbTooltipModule],
  templateUrl: './detail.component.html',
  styles: `
    :host {
      display: contents !important;
    }
  `,
})
export class DetailComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas)

  content = `<h3>This is an Air-mode editable area.</h3>
  <p><br></p>
  <ul>
      <li>Select a text to reveal the toolbar.</li>
      <li>Edit rich document on-the-fly, so elastic!</li>
  </ul>
  <p><br></p>
  <p>End of air-mode area</p>`

  editorConfig = {
    toolbar: [
      [{ font: [] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['direction', { align: [] }],
      ['link', 'image', 'video'],
    ],
  }
}
