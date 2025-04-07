import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [NgbTooltipModule,UIExamplesListComponent],
  templateUrl: './tooltips.component.html',
  styles: ``
})
export class TooltipsComponent {
title="Tooltips"
}
