import { Component } from '@angular/core'
import { LeftTimeLine } from '../../data'

@Component({
  selector: 'left-timeline',
  standalone: true,
  imports: [],
  templateUrl: './left-timeline.component.html',
  styles: ``,
})
export class LeftTimelineComponent {
  timelineList = LeftTimeLine
}
