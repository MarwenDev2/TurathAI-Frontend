import { Component, inject, Input } from '@angular/core'
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import type { ContactType } from '../../data'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './profile.component.html',
  styles: `
    :host {
      display: contents !important;
    }
  `,
})
export class ProfileComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas)

  @Input() profileDetail!: ContactType

  ngOnInit() {}
}
