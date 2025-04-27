import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LeftTimelineComponent } from './components/left-timeline/left-timeline.component';
import { TimelineData } from './data';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [LeftTimelineComponent, CommonModule],
  templateUrl: './timeline.component.html',
  styles: ``,
})
export class TimelineComponent {
  title = 'Timeline';

  timelineList = TimelineData;
}
