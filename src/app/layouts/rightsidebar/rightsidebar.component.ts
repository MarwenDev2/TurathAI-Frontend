import { Component, inject, type OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-rightsidebar',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './rightsidebar.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class RightSidebarComponent implements OnInit {
  offcanvas = inject(NgbActiveOffcanvas);

  color: any;
  topbar: any;
  menuColor: any;
  menuSize: any;

  ngOnInit(): void {

  }
}
