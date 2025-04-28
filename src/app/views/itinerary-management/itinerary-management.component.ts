import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ItenaryService } from '../../core/services/itinerary.service';
import { Itinery } from '../../core/Models/itinerary';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-itinerary-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './itinerary-management.component.html',

})
export class ItineraryManagementComponent implements OnInit {
  itineraries: Itinery[] = [];
  filteredItineraries: Itinery[] = [];
  loading = false;
  error = '';
  
  searchForm: FormGroup;

  constructor(
    private itineraryService: ItenaryService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      id: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      minBudget: [''],
      maxBudget: ['']
    });
  }

  ngOnInit(): void {
    this.loadItineraries();
    this.initSearchFormListeners();
  }

  initSearchFormListeners(): void {
    // Listen to changes in the search form fields
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => {
          return JSON.stringify(prev) === JSON.stringify(curr);
        })
      )
      .subscribe(() => {
        this.filterItineraries();
      });
  }

  filterItineraries(): void {
    const searchCriteria = this.searchForm.value;
    
    // If there's no search criteria, show all itineraries
    if (!searchCriteria.id && !searchCriteria.description && 
        !searchCriteria.startDate && !searchCriteria.endDate && 
        !searchCriteria.minBudget && !searchCriteria.maxBudget) {
      this.filteredItineraries = [...this.itineraries];
      return;
    }

    // Filter itineraries based on search criteria
    this.filteredItineraries = this.itineraries.filter(itinerary => {
      // Match ID
      const matchesId = !searchCriteria.id || 
        itinerary.id.toString().includes(searchCriteria.id);
      
      // Match description
      const matchesDescription = !searchCriteria.description || 
        (itinerary.description && itinerary.description.toLowerCase().includes(searchCriteria.description.toLowerCase()));
      
      // Match start date if specified
      let matchesStartDate = true;
      if (searchCriteria.startDate) {
        const searchDate = new Date(searchCriteria.startDate);
        const itineraryDate = new Date(itinerary.startDate);
        matchesStartDate = itineraryDate >= searchDate;
      }
      
      // Match end date if specified
      let matchesEndDate = true;
      if (searchCriteria.endDate) {
        const searchDate = new Date(searchCriteria.endDate);
        const itineraryDate = new Date(itinerary.endDate);
        matchesEndDate = itineraryDate <= searchDate;
      }
      
      // Match budget range
      const matchesMinBudget = !searchCriteria.minBudget || 
        itinerary.budget >= parseFloat(searchCriteria.minBudget);
      
      const matchesMaxBudget = !searchCriteria.maxBudget || 
        itinerary.budget <= parseFloat(searchCriteria.maxBudget);
      
      // Return true if all enabled criteria match
      return matchesId && matchesDescription && matchesStartDate && 
             matchesEndDate && matchesMinBudget && matchesMaxBudget;
    });
  }

  resetSearch(): void {
    this.searchForm.reset();
    this.filteredItineraries = [...this.itineraries];
  }

  loadItineraries(): void {
    this.loading = true;
    this.itineraryService.getAll().subscribe({
      next: (data) => {
        this.itineraries = data;
        this.filteredItineraries = [...data]; // Initialize filtered itineraries
        this.loading = false;
        this.filterItineraries(); // Apply any existing filters
      },
      error: (err) => {
        this.error = 'Failed to load itineraries';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteItinerary(id: number): void {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      this.loading = true; // Show loading indicator
      this.error = ''; // Clear any previous errors
      
      this.itineraryService.delete(id).subscribe({
        next: () => {
          // Successfully deleted
          this.loading = false;
          console.log('Itinerary deleted successfully');
          this.loadItineraries(); // Refresh the list
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to delete itinerary';
          console.error('Error deleting itinerary:', err);
        }
      });
    }
  }
}
