import { Component } from '@angular/core';
import { EmailTopbarComponent } from './components/email-topbar/email-topbar.component'
import { ComposeComponent } from './components/compose/compose.component'

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [ComposeComponent, EmailTopbarComponent],
  templateUrl: './email.component.html',
  styles: ``
})
export class EmailComponent {
  title="Inbox"
}
