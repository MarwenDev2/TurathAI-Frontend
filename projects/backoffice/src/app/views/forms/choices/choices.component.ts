import { Component } from '@angular/core';
import { SelectFormInputDirective } from '../../../core/directive/select-form-input.directive';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

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
