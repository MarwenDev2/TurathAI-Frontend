import { Component } from '@angular/core'
import { state2Data, stateData } from '../../data'

@Component({
  selector: 'widget-state2',
  standalone: true,
  imports: [],
  templateUrl: './widget-state2.component.html',
  styles: ``,
})
export class WidgetState2Component {
  stateList = stateData
}
