import { Component, inject, ViewChild, type OnInit } from '@angular/core'
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  type Event,
} from '@angular/router'
import { AuthService } from '@core/services/auth.service'
import { TitleService } from '@core/services/title.service'
import {
  NgProgressComponent,
  NgProgressModule,
  type NgProgressRef,
} from 'ngx-progressbar'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgProgressModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  progressRef!: NgProgressRef
  @ViewChild(NgProgressComponent) progressBar!: NgProgressComponent

  private titleService = inject(TitleService)
  private router = inject(Router)

  constructor(private authService: AuthService) {
    this.router.events.subscribe((event: Event) => {
      this.checkRouteChange(event)
    })
  }

  ngOnInit(): void {
    this.titleService.init()
    this.authService.authStateInitialized().subscribe();
  }

  checkRouteChange(routerEvent: Event) {
    if (routerEvent instanceof NavigationStart) {
      this.progressBar.start()
    }
    if (
      routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError
    ) {
      setTimeout(() => {
        this.progressBar.complete()
      }, 200)
    }
  }
}
