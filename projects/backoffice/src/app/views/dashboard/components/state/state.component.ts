import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WidgetCardComponent } from 'projects/backoffice/src/app/components/widget-card/widget-card.component';
import { stateData } from '../../data';

@Component({
  selector: 'dashboard-state',
  standalone: true,
  imports: [CommonModule,WidgetCardComponent],
  templateUrl: './state.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StateComponent {
  stateList = stateData;
}
