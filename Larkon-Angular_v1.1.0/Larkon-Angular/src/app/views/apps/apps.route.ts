import { Route } from '@angular/router'
import { ChatComponent } from './chat/chat.component'
import { EmailComponent } from './email/email.component'
import { CalendarComponent } from './calendar/calendar.component'
import { TodoComponent } from './todo/todo.component'
import { WidgetsComponent } from './widgets/widgets.component'

export const APPS_ROUTES: Route[] = [
  {
    path: 'chat',
    component: ChatComponent,
    data: { title: 'Chat' },
  },
  {
    path: 'email',
    component: EmailComponent,
    data: { title: 'Inbox' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    data: { title: 'Calendar' },
  },
  {
    path: 'todo',
    component: TodoComponent,
    data: { title: 'Todo' },
  },
  {
    path: 'widgets',
    component: WidgetsComponent,
    data: { title: 'Widgets' },
  }
]
