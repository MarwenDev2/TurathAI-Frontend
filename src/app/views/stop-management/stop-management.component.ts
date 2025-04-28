import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StopService } from '@core/services/stop.service';
import { Stop } from '@core/Models/stop';
import { ItenaryService } from '@core/services/itinerary.service';
import { Itinery } from '@core/Models/itinerary';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SmsService } from '@core/services/sms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stop-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    DragDropModule
  ],
  templateUrl: './stop-management.component.html',
  styleUrls: ['./stop-management.component.scss']
})
export class StopManagementComponent implements OnInit {
  itineraryId: number = 0;
  itinerary: Itinery | null = null;
  stops: Stop[] = [];
  filteredStops: Stop[] = [];
  allItineraries: Itinery[] = [];
  loading = false;
  error = '';
  
  showAddForm = false;
  stopForm: FormGroup;
  searchForm: FormGroup;
  editingStopId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private stopService: StopService,
    private itineraryService: ItenaryService,
    private smsService: SmsService,
    private fb: FormBuilder
  ) { 
    this.stopForm = this.fb.group({
      order: [0, Validators.required],
      duration: ['', Validators.required],
      itineryId: [0, Validators.required] // Default to 0, will be set to actual ID
    });

    this.searchForm = this.fb.group({
      duration: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.itineraryId = +params['id'];
      if (this.itineraryId) {
        this.loadItinerary();
        this.loadStops();
        
        // Set the itinerary ID in the form
        this.stopForm.patchValue({
          itineryId: this.itineraryId
        });
      }
    });

    // Set up search form listeners for dynamic search
    this.initSearchFormListeners();
  }

  initSearchFormListeners(): void {
    // Listen to changes in the search form fields
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.filterStops();
      });
  }

  filterStops(): void {
    const searchCriteria = this.searchForm.value;
    
    // If there's no search criteria, show all stops
    if (!searchCriteria.duration) {
      this.filteredStops = [...this.stops];
      return;
    }

    // Filter stops based on search criteria
    this.filteredStops = this.stops.filter(stop => {
      // Check if stop matches the duration search criteria
      const matchesDuration = !searchCriteria.duration || 
        (stop.duration && stop.duration.toLowerCase().includes(searchCriteria.duration.toLowerCase()));
      
      // Return true if duration matches
      return matchesDuration;
    });
  }
  


  loadItinerary(): void {
    this.itineraryService.getById(this.itineraryId).subscribe({
      next: (data: Itinery) => {
        this.itinerary = data;
      },
      error: (err: any) => {
        this.error = 'Failed to load itinerary details';
        console.error(err);
      }
    });
  }

  loadStops(): void {
    this.loading = true;
    this.stopService.getByItineraryId(this.itineraryId).subscribe({
      next: (data: Stop[]) => {
        this.stops = data;
        this.filteredStops = [...data]; // Initialize filtered stops with all stops
        this.loading = false;
        this.filterStops(); // Apply any existing filters
      },
      error: (err: any) => {
        this.error = 'Failed to load stops';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (this.showAddForm) {
      // Ensure itineraryId is always set as a number
      const itineraryIdValue = Number(this.itineraryId);
      
      // Validate itineraryId
      if (!itineraryIdValue || itineraryIdValue <= 0) {
        this.error = 'Cannot add stop: No valid itinerary ID';
        this.showAddForm = false;
        return;
      }
      
      this.stopForm.patchValue({
        order: this.stops.length + 1,
        duration: '',
        itineryId: itineraryIdValue
      });
      
      // Verify itineraryId was set correctly
      console.log('Form initialized with itineraryId:', this.stopForm.get('itineryId')?.value);
      
      this.editingStopId = null;
    }
  }

  editStop(stop: Stop): void {
    this.showAddForm = true;
    this.editingStopId = stop.id;
    
    // Ensure we use the current itineraryId if the stop doesn't have one
    // Convert to Number to ensure it's not a string or null
    const itineraryIdValue = Number(stop.itineryId || this.itineraryId);
    
    // Validate itineraryId
    if (!itineraryIdValue || itineraryIdValue <= 0) {
      this.error = 'Cannot edit stop: No valid itinerary ID';
      this.showAddForm = false;
      return;
    }
    
    this.stopForm.patchValue({
      order: stop.order,
      duration: stop.duration,
      itineryId: itineraryIdValue
    });
    
    // Verify itineraryId was set correctly
    console.log('Edit form initialized with itineraryId:', this.stopForm.get('itineryId')?.value);
  }

  saveStop(): void {
    if (this.stopForm.invalid) {
      return;
    }

    // Enforce itineraryId is a number, not null
    if (!this.itineraryId || this.itineraryId <= 0) {
      this.error = 'Cannot save stop: No valid itinerary ID';
      console.error('Invalid itinerary ID:', this.itineraryId);
      return;
    }

    // Create stop data with itineryId - service will transform it
    const stopData = {
      id: this.editingStopId || 0,
      order: this.stopForm.value.order,
      duration: this.stopForm.value.duration,
      // Pass itineryId as a number - the service will handle the transformation
      itineryId: Number(this.itineraryId)
    };
    
    console.log('Component preparing data:', JSON.stringify(stopData));
    
    if (this.editingStopId) {
      this.stopService.update(stopData).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.loadStops();
          this.toggleAddForm();
        },
        error: (err) => {
          this.error = 'Failed to update stop';
          console.error('Update error:', err);
        }
      });
    } else {
      this.stopService.add(stopData).subscribe({
        next: (response) => {
          console.log('Add response:', response);
          this.loadStops();
          this.toggleAddForm();
        },
        error: (err) => {
          this.error = 'Failed to add stop';
          console.error('Add error:', err);
        }
      });
    }
  }

  deleteStop(id: number): void {
    if (confirm('Are you sure you want to delete this stop?')) {
      this.stopService.delete(id).subscribe({
        next: () => {
          this.loadStops();
        },
        error: (err) => {
          this.error = 'Failed to delete stop';
          console.error(err);
        }
      });
    }
  }

  onDrop(event: CdkDragDrop<Stop[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    
    // Save a copy of the original stops in case we need to rollback
    const originalStops = [...this.stops];
    
    moveItemInArray(this.filteredStops, event.previousIndex, event.currentIndex);
    moveItemInArray(this.stops, event.previousIndex, event.currentIndex);
    
    // Update order property for each stop and ensure they have the itinerary ID
    this.stops.forEach((stop, index) => {
      stop.order = index + 1;
      
      // Ensure each stop has itineryId set (needed for proper backend transformation)
      if (!stop.itineryId && this.itineraryId) {
        stop.itineryId = this.itineraryId;
      }
    });
    
    // Clear any previous error
    this.error = '';
    
    // Show loading state
    this.loading = true;
    
    this.stopService.reorderStops(this.stops).subscribe({
      next: (updatedStops) => {
        console.log('Successfully reordered stops:', updatedStops);
        this.stops = updatedStops;
        this.filterStops(); // Call filterStops() which updates this.filteredStops
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to reorder stops';
        console.error('Error reordering stops:', err);
        
        // Restore original order
        this.stops = originalStops;
        this.filterStops(); // Call filterStops() which updates this.filteredStops
        this.loading = false;
      }
    });
  }

  viewStopDetails(stop: Stop): void {
    // Create a formatted message with stop details
    const details = `
Stop Details:\n
- Order: ${stop.order}\n
- Duration: ${stop.duration}\n
- Stop ID: ${stop.id}\n
- Itinerary ID: ${stop.itineryId}\n`;
    
    // Display the details in an alert for now (you could replace with a modal in the future)
    alert(details);
    
    // Alternative implementation could navigate to a dedicated stop details page:
    // this.router.navigate(['/stop', stop.id]);
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.filteredStops = [...this.stops];
  }

  sendSmsNotification(stopData: any): void {
    if (!this.itinerary) {
      this.error = 'Cannot send SMS: No itinerary information available';
      return;
    }

    // Create a temporary stop object from form data
    const tempStop: Stop = {
      id: this.editingStopId || 0,
      order: stopData.order,
      duration: stopData.duration,
      itineryId: this.itineraryId
    };

    // Prompt for phone number
    Swal.fire({
      title: 'Enter Phone Number',
      input: 'tel',
      inputPlaceholder: 'Enter phone number (e.g., +1234567890)',
      showCancelButton: true,
      confirmButtonText: 'Send SMS',
      showLoaderOnConfirm: true,
      preConfirm: (phoneNumber) => {
        if (!phoneNumber) {
          Swal.showValidationMessage('Please enter a phone number');
          return false;
        }
        return phoneNumber;
      }
    }).then((result) => {
      if (result.isConfirmed && this.itinerary) {
        const phoneNumber = result.value;
        this.smsService.sendStopNotification(tempStop, this.itinerary, phoneNumber).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'SMS Sent',
                text: response.message,
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'SMS Failed',
                text: response.message
              });
            }
          },
          error: (err) => {
            console.error('SMS error:', err);
            Swal.fire({
              icon: 'error',
              title: 'SMS Failed',
              text: 'Failed to send SMS notification. Please try again.'
            });
          }
        });
      }
    });
  }
}
