import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  TemplateRef,
  inject,
} from '@angular/core'
import { ToastService } from '@core/services/toast-service'
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: ``,
  template: `
    @for (toast of toastService.toasts; track $index) {
      <ngb-toast
        [class]="toast.classname"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        <div class="toast-header">
          <div class="auth-logo me-auto">
            <img
              class="logo-dark"
              src="assets/images/logo-dark.png"
              alt="logo-dark"
              height="18"
            />
            <img
              class="logo-light"
              src="assets/images/logo-light.png"
              alt="logo-light"
              height="18"
            />
          </div>
          <small class="text-muted">just now</small>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            (click)="toastService.remove(toast)"
          ></button>
        </div>
        @if (isTemplate(toast)) {
          <ng-template>
            <ng-template [ngTemplateOutlet]="toast.content"></ng-template>
          </ng-template>
        } @else {
          <div class="p-2">{{ toast.content }}</div>
        }
      </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed top-0 end-0 p-3',
    style: 'z-index: 1200',
  },
})
export class ToastsContainer {
  toastService = inject(ToastService)

  isTemplate(toast: any) {
    return toast.content instanceof TemplateRef
  }
}
