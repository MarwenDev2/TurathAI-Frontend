import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

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
