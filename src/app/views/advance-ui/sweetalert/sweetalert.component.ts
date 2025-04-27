import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sweetalert',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './sweetalert.component.html',
  styles: ``
})
export class SweetalertComponent {
  title = "Sweet Alerts"

  basicMessage() {
    Swal.fire({
      title: 'Any fool can use a computer',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  titleText() {
    Swal.fire({
      title: 'The Internet?',
      text: 'That thing is still around?',
      icon: 'question',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  success() {
    Swal.fire({
      title: 'Good job!',
      text: 'You clicked the button!',
      icon: 'success',
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-danger w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  danger() {
    Swal.fire({
      title: 'Oops...',
      text: 'Something went wrong!',
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      footer: '<a href="javascript:void(0);">Why do I have this issue?</a>',
      showCloseButton: false,
    })
  }

  info() {
    Swal.fire({
      title: 'Oops...',
      text: 'Something went wrong!',
      icon: 'info',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      footer: '<a href="javascript:void(0);">Why do I have this issue?</a>',
      showCloseButton: false,
    })
  }
  warning() {
    Swal.fire({
      title: 'Oops...',
      text: 'Something went wrong!',
      icon: 'warning',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },

      buttonsStyling: false,
      footer: '<a href="javascript:void(0);">Why do I have this issue?</a>',
      showCloseButton: false,
    })
  }

  longContent() {
    Swal.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  parameter() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2',
        cancelButton: 'btn btn-danger w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary w-xs mt-2',
          },
          buttonsStyling: false,
        })
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary mt-2',
          },
          buttonsStyling: false,
        })
      }
    })
  }
}
