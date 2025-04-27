import { Component, inject, type TemplateRef } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import {  NgbDropdownModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-offcanvas',
  standalone: true,
  imports: [UIExamplesListComponent,NgbDropdownModule],
  templateUrl: './offcanvas.component.html',
  styles: ``
})
export class OffcanvasComponent {
  title = "Offcanvas"
  private offcanvasService = inject(NgbOffcanvas)

  openStart(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.dismiss()
    this.offcanvasService.open(content, {
      position: 'start',
    })
  }

  openEnd(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'end' })
  }

  openTop(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'top' })
  }

  openBottom(content: TemplateRef<HTMLElement>) {
    this.offcanvasService.open(content, { position: 'bottom' })
  }

  openNoBackdrop(content: TemplateRef<HTMLElement>) {
   this.offcanvasService.open(content,{backdrop:false})
  }

  openScroll(scroll: TemplateRef<any>) {
    this.offcanvasService.open(scroll, { scroll: true })
  }
}
