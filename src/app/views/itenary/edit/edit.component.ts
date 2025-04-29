import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItenaryService } from '@core/services/itinerary.service';
import { Itinery } from '@core/Models/itinerary';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  itenaryForm: FormGroup;
  isLoading = false;
  itenaryId: number = 0;
  itenary?: Itinery;

  constructor(
    private fb: FormBuilder,
    private itenaryService: ItenaryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.itenaryForm = this.fb.group({
      id: [0],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: [0, [Validators.required, Validators.min(0)]],
      userId: [1] // Default userId, you might want to get this from auth service
    });
  }

  ngOnInit(): void {
    // Get the itinerary ID from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.itenaryId = +id;
        this.loadItenary(this.itenaryId);
      } else {
        this.showErrorAlert('Invalid itinerary ID');
        this.router.navigate(['/itenary/list']);
      }
    });
  }

  loadItenary(id: number): void {
    this.isLoading = true;
    this.itenaryService.getById(id).subscribe({
      next: (data) => {
        this.itenary = data;
        // Format dates for the form
        const startDate = data.startDate ? new Date(data.startDate) : null;
        const endDate = data.endDate ? new Date(data.endDate) : null;
        
        this.itenaryForm.patchValue({
          id: data.id,
          description: data.description,
          startDate: startDate ? this.formatDateForInput(startDate) : '',
          endDate: endDate ? this.formatDateForInput(endDate) : '',
          budget: data.budget,
          userId: data.userId
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading itinerary', err);
        this.showErrorAlert('Failed to load itinerary. Please try again.');
        this.isLoading = false;
        this.router.navigate(['/itenary/list']);
      }
    });
  }

  // Format a date as YYYY-MM-DD for input[type="date"]
  formatDateForInput(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

    this.itenaryService.update(formData)
      .subscribe({
        next: () => {
          this.showSuccessAlert('Itinerary updated successfully!');
          this.router.navigate(['/itenary/list']);
        },
        error: (err) => {
          console.error('Error updating itinerary', err);
          this.showErrorAlert('Failed to update itinerary. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
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
