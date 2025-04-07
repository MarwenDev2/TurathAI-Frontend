import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConversationComponent } from './components/conversation/conversation.component';
import { PerformanceComponent } from './components/performance/performance.component';
import { WidgetState2Component } from './components/widget-state2/widget-state2.component';
import { WidgetState3Component } from './components/widget-state3/widget-state3.component';
import { WidgetFriendRequestComponent } from './components/widget-friend-request/widget-friend-request.component';
import { WidgetTaskComponent } from './components/widget-task/widget-task.component';
import { WidgetTransactionComponent } from './components/widget-transaction/widget-transaction.component';
import { RecentProjectComponent } from './components/recent-project/recent-project.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { WidgetStateComponent } from './components/widget-state/widget-state.component';
import { stateData } from '@views/dashboard/data';
import { WidgetCardComponent } from '@component/widget-card/widget-card.component';

@Component({
  selector: 'app-widgets',
  standalone: true,
  imports: [
    ConversationComponent,
    PerformanceComponent,
    WidgetCardComponent,
    WidgetStateComponent,
    WidgetState2Component,
    WidgetState3Component,
    WidgetFriendRequestComponent,
    WidgetTaskComponent,
    WidgetTransactionComponent,
    RecentProjectComponent,
    ScheduleComponent,
  ],
  templateUrl: './widgets.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WidgetsComponent {
  title = 'Widgets';

  stateList = stateData;
}
