import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  type TemplateRef,
} from '@angular/core';
import { HelpList } from './data';
import { DecimalPipe } from '@angular/common';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [DecimalPipe, NgbModalModule],
  templateUrl: './help-center.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpCenterComponent {
  title = 'Help Center';
  helpList = HelpList;

  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}
