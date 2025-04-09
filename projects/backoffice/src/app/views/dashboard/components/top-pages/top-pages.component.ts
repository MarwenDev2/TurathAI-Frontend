import { Component } from '@angular/core';
import { topPages } from '../../data';

@Component({
  selector: 'dashboard-top-pages',
  standalone: true,
  imports: [],
  templateUrl: './top-pages.component.html',
  styles: ``
})
export class TopPagesComponent {
  pageList = topPages
}
