import { Component } from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

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
