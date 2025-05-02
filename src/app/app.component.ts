import { Component, inject, ViewChild, type OnInit, AfterViewInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  type Event,
} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { TitleService } from '@core/services/title.service';
import { UrlPersistenceService } from '@core/services/url-persistence.service';
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgProgressModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private progressRef!: NgProgressRef;
  @ViewChild(NgProgressComponent) private progressBar!: NgProgressComponent;

  private titleService = inject(TitleService);
  private router = inject(Router);
  private urlPersistenceService = inject(UrlPersistenceService);
  private routerEventsSubscription: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.titleService.init();
    this.authService.authStateInitialized().subscribe(() => {
      if (this.authService.isAuthenticated) {
        this.urlPersistenceService.restoreLastUrl();
      }
    });
  }

  ngAfterViewInit(): void {
    // Only subscribe to router events after view is initialized
    this.routerEventsSubscription = this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event);
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  private checkRouteChange(routerEvent: Event): void {
    if (!this.progressBar) return; // Safety check

    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start();
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete();
      }, 200);
    }
  }
}