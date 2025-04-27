import { Component, inject, type TemplateRef } from '@angular/core'
import {
  NgbActiveOffcanvas,
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
  NgbOffcanvas,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap'
import { SharedDataService } from '../filter.service'
import { QuillModule } from 'ngx-quill'
import { SimplebarAngularModule } from 'simplebar-angular'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'email-compose',
  standalone: true,
  imports: [
    NgbModalModule,
    QuillModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    SimplebarAngularModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './compose.component.html',
  styles: `
    :host(email-compose) {
      display: contents !important;
    }
  `,
})
export class ComposeComponent {
  public sharedDataService = inject(SharedDataService)
  private modalService = inject(NgbModal)
  activeOffcanvas = inject(NgbOffcanvas)
  content = ""
  ngOnInit() {}

  updateData(key: string, type: string) {
    this.sharedDataService.updateData(key, type)
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', windowClass: 'compose-mail' })
  }

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
