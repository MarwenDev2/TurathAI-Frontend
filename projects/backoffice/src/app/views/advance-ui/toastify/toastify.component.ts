import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-toastify',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './toastify.component.html',
  styles: ``
})
export class ToastifyComponent {
  title = "Toastify"

  constructor(public toastService: ToastrService) { }

  default() {
    this.toastService.show('Welcome Back! This is a Toast Notification', '', {
      toastClass: 'btn-light text-bg-primary px-3 py-2 mt-2 rounded-1',
      positionClass: 'toast-top-right',
    })
  }

  success(position: any) {
    this.toastService.show('Your application was successfully sent', '', {
      toastClass: 'btn-light text-bg-success px-3 py-2 mt-2 rounded-1',
      positionClass: position,
    })
  }

  warning() {
    this.toastService.show('Warning ! Something went wrong try again', '', {
      toastClass: 'btn-light text-bg-warning px-3 py-2 mt-2 rounded-1',
      positionClass: 'toast-top-center',
    })
  }

  error() {
    this.toastService.show('Error ! An error occurred.', '', {
      toastClass: 'btn-light text-bg-danger px-3 py-2 mt-2 rounded-1',
      positionClass: 'toast-top-center',
    })
  }

  positionToast(position: any) {
    this.toastService.success(
      'Welcome Back ! This is a Toast Notification',
      '',
      {
        timeOut: 3000,
        closeButton: true,
        toastClass: 'btn-light text-bg-success px-3 py-2 mt-2 rounded-1',
        positionClass: position,
        tapToDismiss: true,
      }
    )
  }

  durationToast(position: any) {
    this.toastService.show('Toast Duration 5s', '', {
      timeOut: 5000,
      positionClass: position,
      toastClass: 'btn-light text-bg-success px-3 py-2 mt-2 rounded-1',
      closeButton: false,
    })
  }
}
