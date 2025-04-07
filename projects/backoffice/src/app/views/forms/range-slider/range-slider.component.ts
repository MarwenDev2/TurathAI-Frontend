import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NouisliderModule } from 'ng2-nouislider'

@Component({
  selector: 'app-range-slider',
  standalone: true,
  imports: [UIExamplesListComponent,NouisliderModule,FormsModule],
  templateUrl: './range-slider.component.html',
  styles: ``
})
export class RangeSliderComponent {
  title="Slider"
  someKeyboard = [1, 3]

  someRange3 = 8
  someRange = 10
  range = [-500, 500]
  someRange2config = {
    behaviour: 'drag',
    connect: true,
    margin: 1,
    limit: 5,
    range: {
      min: 0,
      max: 20,
    },
    pips: {
      mode: 'steps',
      density: 5,
    },
  }
  someRange2 = [6.8, 15]

  someKeyboardConfig = {
    behaviour: 'drag',
    connect: true,
    start: [0, 5],
    keyboard: true,
    step: 0.1,
    pageSteps: 10,
    range: {
      min: 0,
      max: 5,
    },
    pips: {
      mode: 'count',
      density: 2,
      values: 6,
      stepped: true,
    },
  }
}
