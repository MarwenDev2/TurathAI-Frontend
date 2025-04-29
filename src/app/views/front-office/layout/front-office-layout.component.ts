import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-front-office-layout',
  templateUrl: './front-office-layout.component.html',
  styleUrls: ['./front-office-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, NgbDropdownModule]
})
export class FrontOfficeLayoutComponent {
  navItems = [
    { label: 'Home', link: '/frontoffice' },
    { label: 'Heritage Sites', link: '/frontoffice/heritage-sites' },
    { label: 'Businesses', link: '/frontoffice/businesses' },
    { label: 'Itineraries', link: '/frontoffice/itineraries' },
    { label: 'About', link: '/frontoffice/about' },
    { label: 'Services', link: '/frontoffice/services' },
    { label: 'Contact', link: '/frontoffice/contact' }
  ];

  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    
    // Update navigation links to use the correct path
    this.navItems = this.navItems.map(item => ({
      ...item,
      link: item.link.replace('/front-office', '/frontoffice')
    }));
  }

  logout(): void {
    this.authService.logout();
  }
}