import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItenaryService } from '@core/services/itinerary.service';
import { StopService } from '@core/services/stop.service';
import { SiteService } from '@core/services/site.service';
import { Itinery } from '@core/Models/itinerary';
import { Stop } from '@core/Models/stop';
import { Site } from '@core/Models/site';
import { HeritageMapPickerComponent } from '../heritage-map-picker/heritage-map-picker.component';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HeritageMapPickerComponent
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  itenaryForm: FormGroup;
  isLoading = false;
  itenaryId: number = 0;
  itenary?: Itinery;
  heritageSites: Site[] = [];
  selectedStops: any[] = [];
  existingStops: Stop[] = [];
  showMap = false;
  isSiteLoading = false;
  siteLoadError = '';

  constructor(
    private fb: FormBuilder,
    private itenaryService: ItenaryService,
    private stopService: StopService,
    private siteService: SiteService,
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
    // Load all heritage sites first
    this.loadHeritageSites();
    
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

  loadHeritageSites(): void {
    this.isSiteLoading = true;
    this.siteService.getAll().subscribe({
      next: (sites) => {
        this.heritageSites = sites;
        this.isSiteLoading = false;
      },
      error: (err) => {
        console.error('Error loading heritage sites:', err);
        this.siteLoadError = 'Failed to load heritage sites. Please refresh the page.';
        this.isSiteLoading = false;
      }
    });
  }
  
  toggleMap(): void {
    this.showMap = !this.showMap;
  }

  loadItenary(id: number): void {
    this.isLoading = true;
    
    // Load both the itinerary and its stops
    this.itenaryService.getById(id).pipe(
      switchMap((data) => {
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
        
        // Now load the stops for this itinerary
        return this.stopService.getByItineraryId(id);
      }),
      catchError(err => {
        console.error('Error loading stops', err);
        this.showErrorAlert('Failed to load itinerary stops. Some data may be missing.');
        return of([]);
      })
    ).subscribe({
      next: (stops) => {
        this.existingStops = stops;
        
        // Transform stops to the format expected by the map picker
        if (stops && stops.length > 0) {
          this.transformStopsForMapPicker(stops);
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error in itinerary loading process', err);
        this.showErrorAlert('Failed to load complete itinerary data. Please try again.');
        this.isLoading = false;
        this.router.navigate(['/itenary/list']);
      }
    });
  }
  
  transformStopsForMapPicker(stops: Stop[]): void {
    // We need to wait for heritage sites to be loaded
    if (this.heritageSites.length === 0) {
      setTimeout(() => this.transformStopsForMapPicker(stops), 500);
      return;
    }
    
    // Map stops to the format expected by the map picker
    this.selectedStops = stops.map(stop => {
      // Find the corresponding heritage site
      const site = this.heritageSites.find(site => site.id === stop.heritageSite?.id);
      
      if (site) {
        return {
          ...site,
          order: stop.order,
          duration: stop.duration,
          // Extract days from duration string (e.g., "2 days" -> 2)
          // Using optional chaining to avoid "Object is possibly 'undefined'" errors
          durationDays: parseInt(stop.duration?.split(' ')?.[0] || '1'),
          stopId: stop.id // Keep track of original stop ID for updates
        };
      }
      return null;
    }).filter(Boolean) as any[];
    
    // Sort by order
    this.selectedStops.sort((a, b) => a.order - b.order);
    
    // Automatically show the map if we have stops
    if (this.selectedStops.length > 0) {
      this.showMap = true;
    }
  }
  
  // Format a date as YYYY-MM-DD for input[type="date"]
  formatDateForInput(date: Date): string {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  onSitesSelected(sites: any[]): void {
    this.selectedStops = sites;
    
    // Preserve the original duration format for existing stops
    this.selectedStops.forEach(stop => {
      if (!stop.duration) {
        // Only add a default duration if it's missing
        const days = stop.durationDays || 1;
        stop.duration = `${days}`;
      } else if (stop.duration && !stop.stopId) {
        // For new stops, ensure we use the format without "days"
        const days = parseInt(stop.duration.split(' ')[0]) || stop.durationDays || 1;
        stop.duration = `${days}`;
      }
    });
  }
  
  onSubmit(): void {
    if (this.itenaryForm.invalid) {
      this.showErrorAlert('Please fill all required fields');
      return;
    }

    // Check total duration matches
    const formData = {...this.itenaryForm.value};
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    // Calculate total days of itinerary
    const itineraryDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Calculate total days from stops
    let totalStopDays = 0;
    this.selectedStops.forEach(stop => {
      // Using optional chaining to avoid "Object is possibly 'undefined'" errors
      const days = parseInt(stop.duration?.split(' ')?.[0] || '0');
      if (!isNaN(days)) {
        totalStopDays += days;
      }
    });
    
    // Check if total days exceed itinerary duration
    if (totalStopDays > itineraryDays) {
      this.showErrorAlert(`Your stops require ${totalStopDays} days, but your itinerary is only ${itineraryDays} days long. Please adjust your dates or reduce stop durations.`);
      return;
    }
    
    // Warn if there's a significant difference
    if (totalStopDays < itineraryDays - 1) {
      if (!confirm(`Your stops only account for ${totalStopDays} days, but your itinerary is ${itineraryDays} days long. Do you want to continue?`)) {
        return;
      }
    }

    this.isLoading = true;
    
    // Format dates properly before sending
    if (formData.startDate) {
      formData.startDate = new Date(formData.startDate);
    }
    if (formData.endDate) {
      formData.endDate = new Date(formData.endDate);
    }

    this.itenaryService.update(formData)
      .pipe(
        switchMap(() => {
          // Instead of deleting all stops and creating new ones, we'll handle updates intelligently
          
          // 1. Find which stops to update (they have stopId from existing records)
          const stopsToUpdate = this.selectedStops.filter(stop => stop.stopId);
          
          // 2. Find which stops to create (they don't have stopId)
          const stopsToCreate = this.selectedStops.filter(stop => !stop.stopId);
          
          // 3. Find which stops to delete (in existingStops but not in selectedStops)
          const stopIdsToKeep = stopsToUpdate.map(stop => stop.stopId);
          const stopsToDelete = this.existingStops.filter(stop => !stopIdsToKeep.includes(stop.id));
          
          // Group all operations
          const operations: any[] = [];
          
          // Handle deletes
          if (stopsToDelete.length > 0) {
            const deleteOps = stopsToDelete.map(stop => 
              this.stopService.delete(stop.id).pipe(
                catchError(err => {
                  console.error(`Error deleting stop ${stop.id}`, err);
                  return of(null);
                })
              )
            );
            operations.push(...deleteOps);
          }
          
          // Handle updates
          if (stopsToUpdate.length > 0) {
            const updateOps = stopsToUpdate.map(stop => 
              this.stopService.update({
                id: stop.stopId,
                order: stop.order,
                duration: stop.duration,
                itineryId: this.itenaryId,
                heritageSiteId: stop.id
              }).pipe(
                catchError(err => {
                  console.error(`Error updating stop ${stop.stopId}`, err);
                  return of(null);
                })
              )
            );
            operations.push(...updateOps);
          }
          
          // Handle creates
          if (stopsToCreate.length > 0) {
            const createOps = stopsToCreate.map(stop => 
              this.stopService.add({
                id: 0,
                order: stop.order,
                duration: stop.duration,
                itineryId: this.itenaryId,
                heritageSiteId: stop.id
              }).pipe(
                catchError(err => {
                  console.error(`Error creating new stop for site ${stop.id}`, err);
                  return of(null);
                })
              )
            );
            operations.push(...createOps);
          }
          
          // If no operations, return empty array
          if (operations.length === 0) {
            return of([]);
          }
          
          // Execute all operations in parallel
          return forkJoin(operations);
        })
      )
      .subscribe({
        next: () => {
          this.showSuccessAlert(`Itinerary updated successfully with ${this.selectedStops.length} stops!`);
          // Ensure proper redirection to the itinerary list
          this.router.navigate(['/itenary/list']);
        },
        error: (err) => {
          console.error('Error updating itinerary or stops', err);
          this.showErrorAlert('Failed to update itinerary completely. Some changes may not have been saved.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  showSuccessAlert(message: string): void {
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
  
  showErrorAlert(message: string): void {
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
