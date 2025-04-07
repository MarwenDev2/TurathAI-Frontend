import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-placeholders',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './placeholders.component.html',
  styles: ``
})
export class PlaceholdersComponent {
title="placeholders"
}
