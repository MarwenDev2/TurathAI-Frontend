import { Component } from '@angular/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-scrollbar',
  standalone: true,
  imports: [UIExamplesListComponent,SimplebarAngularModule],
  templateUrl: './scrollbar.component.html',
  styles: ``
})
export class ScrollbarComponent {
title="Scrollbar"
}
