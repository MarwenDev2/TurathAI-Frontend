import { Component, ChangeDetectorRef, inject, Renderer2, type OnInit, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RightSidebarComponent } from '../rightsidebar/rightsidebar.component';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { getSidebarsize } from '@store/layout/layout-selector';
import { changesidebarsize } from '@store/layout/layout-action';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
    RightSidebarComponent,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styles: ``,
  providers: [NgbActiveOffcanvas],
})
export class LayoutComponent implements OnInit {
  title!: string;
  layoutType: any;

  private cdr = inject(ChangeDetectorRef);
  private store = inject(Store);
  private renderer = inject(Renderer2);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    this.store.select('layout').subscribe((data) => {
      this.layoutType = data.LAYOUT;
      document.documentElement.setAttribute('data-bs-theme', data.LAYOUT_THEME);

      document.documentElement.setAttribute('data-menu-color', data.MENU_COLOR);
      document.documentElement.setAttribute(
        'data-topbar-color',
        data.TOPBAR_COLOR,
      );
      document.documentElement.setAttribute('data-menu-size', data.MENU_SIZE);
    });
    if (document.documentElement.clientWidth <= 1140) {
      this.onResize()
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (document.documentElement.clientWidth <= 1140) {
      this.store.dispatch(changesidebarsize({ size: 'hidden' }))
    } else {
      this.store.dispatch(changesidebarsize({ size: 'default' }))
      document.documentElement.classList.remove('sidebar-enable')
      const backdrop = document.querySelector('.offcanvas-backdrop')
      if (backdrop) this.renderer.removeChild(document.body, backdrop)
    }
    this.store.select(getSidebarsize).subscribe((size: string) => {
      this.renderer.setAttribute(
        document.documentElement,
        'data-sidenav-size',
        size
      )
    })
  }

  onActivate(componentReference: any) {
    this.title = componentReference.title;
    this.cdr.detectChanges();
  }

  onSettingsButtonClicked() {
    this.offcanvasService.open(RightSidebarComponent, {
      position: 'end',
      panelClass: 'border-0',
    });
  }

  onToggleMobileMenu() {
    this.store.select(getSidebarsize).subscribe((size: any) => {
      document.documentElement.setAttribute('data-menu-size', size);
    });

    const size = document.documentElement.getAttribute('data-menu-size');

    document.documentElement.classList.toggle('sidebar-enable');
    if (size != 'hidden') {
      if (document.documentElement.classList.contains('sidebar-enable')) {
        this.store.dispatch(changesidebarsize({ size: 'condensed' }));
      } else {
        this.store.dispatch(changesidebarsize({ size: 'default' }));
      }
    } else {
      this.showBackdrop();
    }
  }

  showBackdrop() {
    const backdrop = this.renderer.createElement('div');
    this.renderer.addClass(backdrop, 'offcanvas-backdrop');
    this.renderer.addClass(backdrop, 'fade');
    this.renderer.addClass(backdrop, 'show');
    this.renderer.appendChild(document.body, backdrop);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    if (window.innerWidth > 1040) {
      this.renderer.setStyle(document.body, 'paddingRight', '15px');
    }

    this.renderer.listen(backdrop, 'click', () => {
      document.documentElement.classList.remove('sidebar-enable');
      this.renderer.removeChild(document.body, backdrop);
      this.renderer.setStyle(document.body, 'overflow', null);
      this.renderer.setStyle(document.body, 'paddingRight', null);
    });
  }
}
