
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Output,
  type OnInit,
} from '@angular/core'
import { register } from 'swiper/element'
import {
  ContactList,
  GroupList,
  UserContact,
  UserList,
  type ContactType,
  type GroupType,
  type UserContactType,
} from '../../data'
import type { SwiperOptions } from 'swiper/types'
import { NgbNavModule, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { SettingComponent } from '../setting/setting.component'
import { FormsModule } from '@angular/forms'
import { SwiperDirective } from '@core/directive/swiper-directive.component'
import { CommonModule } from '@angular/common'
register()

@Component({
  selector: 'chat-contacts',
  standalone: true,
  imports: [SwiperDirective, NgbNavModule, SimplebarAngularModule, FormsModule,CommonModule],
  templateUrl: './contacts.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactsComponent implements OnInit {
  userData = UserList
  contactData = ContactList
  groupData = GroupList
  userContactList = UserContact
  searchText: string = ''

  @Output() profileDetail = new EventEmitter<
    ContactType | GroupType | UserContactType
  >()

  private offcanvasService = inject(NgbOffcanvas)

  ngOnInit(): void {
    // Fetch Data
    const data = this.contactData[2]
    this.profileDetail.emit(data)
  }

  swiperConfig: SwiperOptions = {
    slidesPerView: 7.5,
    loop: true,
  }

  openSetting(divId: string) {
    if(this.offcanvasService.hasOpenOffcanvas()){
      this.offcanvasService.dismiss()
    }
    const divElement = document.getElementById(divId)!
    if (this.offcanvasService.hasOpenOffcanvas()) {
      this.offcanvasService.open(SettingComponent)
    } else {
      this.offcanvasService.open(SettingComponent, {
        container: divElement,
        panelClass: 'position-absolute shadow w-100',
        backdrop: false,
      })
    }
  }

  getDetail(user: ContactType | GroupType | UserContactType) {
    const data = user
    this.profileDetail.emit(data)
  }

  searchContact() {
    this.contactData = ContactList.filter(
      (user) =>
        user.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0
    )
  }
}
