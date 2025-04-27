import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'category-general-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './general-info.component.html',
  styles: ``
})
export class GeneralInfoComponent {

}
