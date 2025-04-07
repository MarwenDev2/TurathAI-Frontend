import { Component } from '@angular/core';
import { NgbDropdownModule, NgbScrollSpyModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-scrollspy',
  standalone: true,
  imports: [NgbScrollSpyModule,NgbDropdownModule],
  templateUrl: './scrollspy.component.html',
  styles: ``
})
export class ScrollspyComponent {
title="Scrollspy"
}
