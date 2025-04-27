import {
  Component,
  inject,
  Input,
  Renderer2,
  ViewChild,
  type TemplateRef,
} from '@angular/core';
import {
  MessageData,
  type ContactType,
  type GroupType,
  type UserContactType,
} from '../../data';
import { CommonModule } from '@angular/common';
import {
  SimplebarAngularModule,
  type SimplebarAngularComponent,
} from 'simplebar-angular';
import {
  NgbDropdownModule,
  NgbModal,
  NgbOffcanvas,
} from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from '../profile/profile.component';
import { ContactsComponent } from '../contacts/contacts.component';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
  type UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'chat-list',
  standalone: true,
  imports: [
    CommonModule,
    SimplebarAngularModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    // PickerModule,
  ],
  templateUrl: './chat-list.component.html',
  styles: ``,
})
export class ChatListComponent {
  @Input() profileDetail!: ContactType | GroupType | UserContactType;

  messagesList = MessageData;
  formData!: UntypedFormGroup;
  submitted = false;
  emoji = '';

  public offCanvas = inject(NgbOffcanvas);
  private modalService = inject(NgbModal);
  public formBuilder = inject(UntypedFormBuilder);
  public renderer = inject(Renderer2);

  @ViewChild('scrollRef', { static: false })
  scrollRef!: SimplebarAngularComponent;

  ngOnInit(): void {
    // Validation
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
  }

  getProfileImage(): string | undefined {
    if ('image' in this.profileDetail) {
      return this.profileDetail.image;
    }
    return undefined;
  }

  ngAfterViewInit() {
    this.scrollRef.SimpleBar.getScrollElement().scrollTop = 300;
    this.onListScroll();
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight;
      }, 100);
    }
  }

  openProfile() {
    if(this.offCanvas.hasOpenOffcanvas()){
      this.offCanvas.dismiss()
    }
    const divElement = document.getElementById('chatArea')!;
    const offcanvasRef = this.offCanvas.open(ProfileComponent, {
      panelClass: 'position-absolute shadow border-start show',
      position: 'end',
      container: divElement,
      backdrop: false,
      scroll: true,
    });
    offcanvasRef.componentInstance.profileDetail = this.profileDetail;
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'sm', centered: true });
  }

  openContactMenu() {
    this.offCanvas.open(ContactsComponent, {
      panelClass: 'chatOffcanvas',
    });
  }

  get form() {
    return this.formData.controls;
  }

  messageSend() {
    const message = this.formData.get('message')!.value;
    if (this.formData.valid && message) {
      this.messagesList.push({
        id: this.messagesList.length + 1,
        msg: [{ text: message }],
        timeStamp: new Date().getHours() + ':' + new Date().getMinutes(),
        isSender: true,
        isRead: true,
      });
      setTimeout(() => {
        this.messagesList.push({
          id: this.messagesList.length + 1,
          msg: [{ text: 'Server is not connected 😔' }],
          timeStamp: new Date().getHours() + ':' + new Date().getMinutes(),
          isSender: false,
        });
        this.onListScroll();
      }, 1000);
    } else {
      this.renderer.addClass(
        document.querySelector('.needs-validation'),
        'was-validated',
      );
    }

    this.onListScroll();
    setTimeout(() => {
      this.formData.reset();
    }, 500);
  }

  // Emoji Picker
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger',
  ];
  set = 'twitter';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  // addEmoji(event: EmojiEvent) {
  //   const { emoji } = this;
  //   let text;
  //   if (emoji) {
  //     text = `${emoji}${event.emoji.native}`;
  //   } else {
  //     text = `${event.emoji.native}`;
  //   }
  //   this.emoji = text;
  //   this.showEmojiPicker = false;
  // }
}
