import { Component, inject } from '@angular/core'
import { EmailListComponent } from '../email-list/email-list.component'
import {
  NgbDropdownModule,
  NgbOffcanvas,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap'
import { ComposeComponent } from '../compose/compose.component'

@Component({
  selector: 'email-topbar',
  standalone: true,
  imports: [EmailListComponent, NgbDropdownModule, NgbTooltipModule],
  templateUrl: './email-topbar.component.html',
  styles: ``,
})
export class EmailTopbarComponent {
  private offcanvasService = inject(NgbOffcanvas)
  openSidebar() {
    this.offcanvasService.open(ComposeComponent)
  }
}
