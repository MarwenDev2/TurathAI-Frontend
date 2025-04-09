import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

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
