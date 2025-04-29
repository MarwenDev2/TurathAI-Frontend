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
import { SimplebarAngularModule } from 'simplebar-angular';
import { ActivitiStremComponent } from './component/activiti-strem/activiti-strem.component';
import { notificationsData } from './data';
import { User } from '@core/Models/user';
import { AuthService } from '@core/services/auth.service';

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
  offcanvasService = inject(NgbOffcanvas);
  currentUser: User | null = null;
  notificationList = notificationsData;

  constructor(private authService: AuthService) {}
    
    ngOnInit(): void {
      this.authService.currentUser$.subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (err) => {
          console.error('Error loading user data', err);
        }
      });
    }

    logout() {
      this.authService.logout();
    }    
  settingMenu() {
    this.settingsButtonClicked.emit();
  }

  toggleMobileMenu() {
    this.mobileMenuButtonClicked.emit();
  }
  getProfileImage(): string {
    if (!this.currentUser?.image) return 'assets/images/default-avatar.png';
    return `http://localhost:9090/assets/images/users/${this.currentUser.image}`;
  }
  
  open() {
    this.offcanvasService.open(ActivitiStremComponent, {
      position: 'end',
      panelClass: 'border-0 width-auto',
    });
  }
}
