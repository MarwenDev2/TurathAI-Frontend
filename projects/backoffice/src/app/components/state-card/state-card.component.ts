import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core'

export type StateType = {
  title: string;
  items?: number;
  value?: number;
  icon: string;
  badge?: number;
  badgeColor?: string;
};

@Component({
  selector: 'state-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './state-card.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StateCardComponent {
 @Input() data!:StateType;
}
