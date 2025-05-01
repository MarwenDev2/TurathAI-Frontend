import { Component, OnInit } from '@angular/core';
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
export class FrontOfficeLayoutComponent implements OnInit {
  navItems = [
    { label: 'Home', link: '/frontoffice' },
    { label: 'Heritage Sites', link: '/frontoffice/heritage-sites' },
    { label: 'Local', link: '/frontoffice/local-insight' },
    { label: 'Businesses', link: '/frontoffice/businesses' },
    { label: 'Itineraries', link: '/frontoffice/itineraries' },
    { label: 'Forums', link: '/frontoffice/forums' }
  ];

  currentUser$: Observable<User | null>;
  currentYear: number = new Date().getFullYear();

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    
    // Update navigation links to use the correct path
    this.navItems = this.navItems.map(item => ({
      ...item,
      link: item.link.replace('/front-office', '/frontoffice')
    }));
  }

  ngOnInit(): void {
    // Initialize any additional resources here
  }

  logout(): void {
    this.authService.logout();
  }
  
  getUserImage(user: User): string {
    if (!user.image) return 'assets/images/default-avatar.png';
    return `http://localhost:8080/assets/images/users/${user.image}`;
  }
  
}