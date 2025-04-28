import { Component } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'edit-product-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './product-info.component.html',
  styles: ``
})
export class ProductInfoComponent {

}
