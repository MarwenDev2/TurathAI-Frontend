import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItenaryService } from '@core/services/itinerary.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
  itenaryForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private itenaryService: ItenaryService,
    private router: Router
  ) {
    this.itenaryForm = this.fb.group({
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      userId: [1, Validators.required] // Default userId, you might want to get this from auth service
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.itenaryForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    this.isLoading = true;
    
    // Format dates properly before sending
    const formData = {...this.itenaryForm.value};
    if (formData.startDate) {
      formData.startDate = new Date(formData.startDate);
    }
    if (formData.endDate) {
      formData.endDate = new Date(formData.endDate);
    }

    this.itenaryService.add(formData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Itinerary added successfully!');
          this.resetForm();
          this.router.navigate(['/itenary/list']);
        },
        error: (err) => {
          console.error('Error adding itinerary', err);
          this.showErrorAlert('Failed to add itinerary. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  resetForm() {
    this.itenaryForm.reset({
      budget: 0,
      userId: 1
    });
  }

  showSuccessAlert(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-primary w-xs me-2 mt-2'
      },
      buttonsStyling: false
    });
  }

  showErrorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'btn btn-danger w-xs me-2 mt-2'
      },
      buttonsStyling: false
    });
  }
}
