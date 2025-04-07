import { Component } from '@angular/core';
import { ChatListComponent } from './components/chat-list/chat-list.component'
import { ContactsComponent } from './components/contacts/contacts.component'
import type { ContactType, GroupType, UserContactType } from './data'

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ContactsComponent, ChatListComponent],
  templateUrl: './chat.component.html',
  styles: ``,
})
export class ChatComponent {
  title = 'Chat';
  profileDetail!: ContactType | GroupType | UserContactType

  receiveDataFromChild(data: ContactType | GroupType | UserContactType) {
    this.profileDetail = data
  }
}
