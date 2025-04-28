import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';

@Component({
  selector: 'app-choices',
  standalone: true,
  imports: [UIExamplesListComponent,SelectFormInputDirective],
  templateUrl: './choices.component.html',
  styles: ``
})
export class ChoicesComponent {
title="Form Select"
}
