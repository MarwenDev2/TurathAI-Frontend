import { Component } from '@angular/core';
import { currentYear } from '@common/constants';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { FlatpickrDirective } from '@core/directive/flatpickr.directive';

@Component({
  selector: 'app-flatepicker',
  standalone: true,
  imports: [FlatpickrDirective,UIExamplesListComponent],
  templateUrl: './flatepicker.component.html',
  styles: ``
})
export class FlatepickerComponent {
title="Flatpicker"
currentYear = currentYear
}
