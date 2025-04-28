import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo-box',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div [class]="className">
      <a routerLink="/" class="logo-dark">
        @if (size) {
          <img src="assets/images/logo-sm.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/logo-dark.png"
            class="logo-lg"
            alt="logo dark"
          />
        } @else {
          <img src="assets/images/logo-dark.png" height="24" alt="logo dark" />
        }
      </a>

      <a routerLink="/" class="logo-light">
        @if (size) {
          <img src="assets/images/logo-sm.png" class="logo-sm" alt="logo sm" />
          <img
            src="assets/images/logo-light.png"
            class="logo-lg"
            alt="logo light"
          />
        } @else {
          <img
            src="assets/images/logo-light.png"
            height="24"
            alt="logo light"
          />
        }
      </a>
    </div>
  `,
})
export class LogoBoxComponent {
  @Input() className: string = '';
  @Input() size: boolean = false;
}
