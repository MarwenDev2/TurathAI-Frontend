import { Component, inject, Renderer2, type OnDestroy, type OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-layout.component.html',
  styles: ``,
})
export class AuthLayoutComponent implements OnInit,OnDestroy {
  renderer = inject(Renderer2);

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'vh-100');
  }

  ngOnDestroy (): void {
    this.renderer.removeClass(document.body, 'vh-100');
  }
}
