import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './basic.component.html',
  styles: ``
})
export class BasicComponent {
title="FORM BASIC ELEMENT"
}
