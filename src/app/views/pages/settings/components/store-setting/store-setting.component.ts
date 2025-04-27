import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive'

@Component({
  selector: 'store-setting',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './store-setting.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StoreSettingComponent {

}
