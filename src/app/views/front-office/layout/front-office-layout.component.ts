import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { logout } from '@store/authentication/authentication.actions';

@Component({
  selector: 'app-front-office-layout',
  templateUrl: './front-office-layout.component.html',
  styleUrls: ['./front-office-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule]
})
export class FrontOfficeLayoutComponent {
  navItems = [
    { label: 'Home', link: '/front-office' },
    { label: 'Itineraries', link: '/front-office/itineraries' },
    { label: 'About', link: '/front-office/about' },
    { label: 'Services', link: '/front-office/services' },
    { label: 'Contact', link: '/front-office/contact' }
  ];

  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(logout());
  }
} 