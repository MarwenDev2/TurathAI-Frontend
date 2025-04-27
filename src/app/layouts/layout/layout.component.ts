import { Component, ChangeDetectorRef, inject, Renderer2, type OnInit, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { FooterComponent } from '../footer/footer.component';
import { RightSidebarComponent } from '../rightsidebar/rightsidebar.component';
import { RouterModule } from '@angular/router';
import { NgbActiveOffcanvas, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    TopbarComponent,
    FooterComponent,
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
  private renderer = inject(Renderer2);
  private offcanvasService = inject(NgbOffcanvas);

  ngOnInit(): void {
    console.log('LayoutComponent initialized');
    // Initialize any default layout settings here
    document.documentElement.setAttribute('data-bs-theme', 'light');
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
