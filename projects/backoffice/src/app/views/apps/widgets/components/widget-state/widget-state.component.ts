import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { state2Data } from '../../data';

@Component({
  selector: 'widget-state',
  standalone: true,
  imports: [],
  templateUrl: './widget-state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetStateComponent {
  stateData = state2Data;
}
