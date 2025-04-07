import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

type StateType = {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: string;
  change_type: string;
};

@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetCardComponent {
  @Input() item!:StateType;
}
