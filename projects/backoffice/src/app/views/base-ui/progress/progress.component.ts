import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [NgbProgressbarModule,UIExamplesListComponent],
  templateUrl: './progress.component.html',
  styles: ``
})
export class ProgressComponent {
title="progress"
}
