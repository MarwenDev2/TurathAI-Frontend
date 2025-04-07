import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popovers',
  standalone: true,
  imports: [NgbPopoverModule,UIExamplesListComponent],
  templateUrl: './popovers.component.html',
  styles: ``
})
export class PopoversComponent {
title="popovers"
}
