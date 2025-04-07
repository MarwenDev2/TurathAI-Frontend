import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { SimplebarAngularModule } from 'simplebar-angular';

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
