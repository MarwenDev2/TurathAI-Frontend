import { Component, inject, type OnInit } from '@angular/core';
import { emailData } from '../../data';
import { CommonModule } from '@angular/common';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbOffcanvas,
  type NgbNavChangeEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from '../filter.service';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'email-list',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './email-list.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class EmailListComponent implements OnInit {
  emailList = emailData;
  emailTab!: string;
  public sharedDataService = inject(SharedDataService);
  public offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.sharedDataService.key$.subscribe((data) => {
      this.emailTab = data?.key!;
      if (data && data.type == 'label' && data.key) {
        this.emailList = emailData.filter((item) => item.type == data.key);
      } else if (data && data.type == 'type' && data.key != 'inbox') {
        this.emailList = emailData.filter(
          (item) => (item as any)[data.key] === true,
        );
      } else {
        this.emailList = emailData;
      }
    });
    this.emailTab = 'inbox';
  }

  typeFilter(event: NgbNavChangeEvent) {
    if (event.nextId == 'primary') {
      this.emailList = emailData;
    } else {
      this.emailList = emailData.filter((item) => item.type == event.nextId);
    }
  }

  openDetail() {
    const divContainer = document.getElementById('detailDiv')!;
    this.offcanvasService.open(DetailComponent, {
      panelClass: 'mail-read position-absolute shadow show',
      backdrop: false,
      position: 'end',
      container: divContainer,
      scroll: true,
    });
  }
}
