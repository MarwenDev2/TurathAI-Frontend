import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { SelectFormInputDirective } from '@core/directive/select-form-input.directive';
import { NouisliderModule } from 'ng2-nouislider';

@Component({
  selector: 'add-seller-information',
  standalone: true,
  imports: [SelectFormInputDirective, NouisliderModule,FormsModule],
  templateUrl: './seller-information.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SellerInformationComponent {
  someRange = [0, 200];
}
