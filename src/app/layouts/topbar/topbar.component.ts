import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NgbActiveOffcanvas,
  NgbDropdownModule,
  NgbOffcanvas,
  NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { changetheme } from '@store/layout/layout-action';
import { getLayoutColor } from '@store/layout/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ActivitiStremComponent } from './component/activiti-strem/activiti-strem.component';
import { notificationsData } from './data';
import { logout } from '@store/authentication/authentication.actions';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgbOffcanvasModule,
    SimplebarAngularModule,
    NgbDropdownModule,
  ],
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveOffcanvas],
})
export class TopbarComponent {
  @Input() title: string | undefined;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  router = inject(Router);
  store = inject(Store);
  offcanvasService = inject(NgbOffcanvas);

  notificationList = notificationsData;

  settingMenu() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit();
  }

  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme');
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }));
    } else {
      this.store.dispatch(changetheme({ color: 'light' }));
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color);
    });
  }

  logout() {
    this.store.dispatch(logout())
  }

  open() {
    this.offcanvasService.open(ActivitiStremComponent, {
      position: 'end',
      panelClass: 'border-0 width-auto',
    });
  }
}
