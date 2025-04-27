import { Component, inject, type OnInit } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import {
  changemenucolor,
  changesidebarsize,
  changetheme,
  changetopbarcolor,
  resetState,
} from '@store/layout/layout-action';
import {
  getLayoutColor,
  getMenucolor,
  getSidebarsize,
  getTopbarcolor,
} from '@store/layout/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'app-rightsidebar',
  standalone: true,
  imports: [SimplebarAngularModule],
  templateUrl: './rightsidebar.component.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class RightSidebarComponent implements OnInit {
  offcanvas = inject(NgbActiveOffcanvas);
  store = inject(Store);

  color: any;
  topbar: any;
  menuColor: any;
  menuSize: any;

  ngOnInit(): void {
    this.store.select('layout').subscribe((data: any) => {
      this.color = data.LAYOUT_THEME;
      this.topbar = data.TOPBAR_COLOR;
      this.menuColor = data.MENU_COLOR;
      this.menuSize = data.MENU_SIZE;
    });
  }

  // Change Layout Color
  changeLayoutColor(color: any) {
    this.store.dispatch(changetheme({ color }));
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color);
    });
  }

  // Change Topbar Color
  changeTopbar(topbar: any) {
    this.store.dispatch(changetopbarcolor({ topbar }));
    this.store.select(getTopbarcolor).subscribe((topbar) => {
      document.documentElement.setAttribute('data-topbar-color', topbar);
    });
  }

  // Change Menu Color
  changeMenu(menu: any) {
    this.store.dispatch(changemenucolor({ menu }));
    this.store.select(getMenucolor).subscribe((menucolor) => {
      document.documentElement.setAttribute('data-menu-color', menucolor);
    });
  }

  // Change Sidebar Size
  changeSize(size: any) {
    this.store.dispatch(changesidebarsize({ size }));
    this.store.select(getSidebarsize).subscribe((size) => {
      document.documentElement.setAttribute('data-menu-size', size);
    });
  }

  // Reset Option
  reset() {
    this.store.dispatch(resetState());
  }
}
