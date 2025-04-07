import { Component } from '@angular/core'
import { SimplebarAngularModule } from 'simplebar-angular'
import { CommonModule } from '@angular/common'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { FriendRequest } from '../../data'

@Component({
  selector: 'widget-friend-request',
  standalone: true,
  imports: [SimplebarAngularModule, CommonModule, NgbDropdownModule],
  templateUrl: './widget-friend-request.component.html',
  styles: ``,
})
export class WidgetFriendRequestComponent {
  friendList = FriendRequest
}
