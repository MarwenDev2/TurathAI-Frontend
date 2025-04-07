import { Component } from '@angular/core'
import { ScheduleData } from '../../data'
import { NgbAlertModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'widget-schedule',
  standalone: true,
  imports: [NgbAlertModule, CommonModule, NgbDropdownModule],
  templateUrl: './schedule.component.html',
  styles: ``,
})
export class ScheduleComponent {
  scheduleList = ScheduleData
}
