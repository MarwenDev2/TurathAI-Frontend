import { Component, EventEmitter, Input, Output, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Site } from '@core/Models/site';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Fix for marker icons in Angular
const iconRetinaUrl = '/assets/marker-icon-2x.png';
const iconUrl = '/assets/marker-icon.png';
const shadowUrl = '/assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Define a special icon for selected sites
const selectedIcon = L.icon({
  iconUrl: '/assets/marker-icon-red.png', // You might need to create this asset
  iconRetinaUrl: '/assets/marker-icon-red-2x.png', // You might need to create this asset
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-heritage-map-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div id="heritage-map" style="height: 400px; width: 100%;"></div>
    
    <div *ngIf="routePoints && routePoints.length > 1" class="alert alert-info mt-3">
      <strong>Itinerary Route:</strong> The map shows the entire route for your planned itinerary.
    </div>
    
    <div class="mt-3 mb-3">
      <h5>Selected Heritage Sites ({{ selectedSites.length }})</h5>
      <div *ngIf="selectedSites.length === 0" class="alert alert-info">
        Click on heritage sites on the map to add them to your itinerary.
      </div>
      
      <div *ngIf="tempSelectedSite" class="card mb-3 border-primary">
        <div class="card-body">
          <h6 class="card-title">Add {{tempSelectedSite.name}} to your itinerary:</h6>
          <div class="d-flex gap-2 mt-2">
            <input 
              type="number" 
              min="1"
              class="form-control w-25" 
              [(ngModel)]="tempSelectedSite.durationDays" 
              placeholder="Days"
            >
            <button class="btn btn-primary btn-sm" (click)="confirmAddSite('start')">
              Add to Start
            </button>
            <button class="btn btn-primary btn-sm" (click)="confirmAddSite('middle')" [disabled]="selectedSites.length < 2">
              Add to Middle
            </button>
            <button class="btn btn-primary btn-sm" (click)="confirmAddSite('end')">
              Add to End
            </button>
            <button class="btn btn-secondary btn-sm" (click)="cancelAddSite()">
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      <ul class="list-group">
        <li *ngFor="let site of selectedSites; let i = index" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <span class="badge bg-primary me-2">{{ i + 1 }}</span>
            <strong>{{ site.name }}</strong>
            <span class="badge bg-success ms-2">{{ site.durationDays }} day{{ site.durationDays > 1 ? 's' : '' }}</span>
          </div>
          <div class="d-flex align-items-center">
            <div class="input-group me-2" style="width: 150px;">
              <span class="input-group-text">Days</span>
              <input 
                type="number" 
                min="1"
                class="form-control" 
                [(ngModel)]="site.durationDays" 
                placeholder="Days"
                (change)="updateDuration(i, $event)"
              >
            </div>
            <button class="btn btn-outline-primary btn-sm me-1" (click)="moveStop(i, 'up')" [disabled]="i === 0">
              <i class="fa fa-arrow-up"></i>
            </button>
            <button class="btn btn-outline-primary btn-sm me-1" (click)="moveStop(i, 'down')" [disabled]="i === selectedSites.length - 1">
              <i class="fa fa-arrow-down"></i>
            </button>
            <button class="btn btn-danger btn-sm" (click)="removeSite(i)">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class HeritageMapPickerComponent implements AfterViewInit, OnChanges {
  @Input() heritageSites: Site[] = [];
  @Input() initialSelectedSites: any[] = []; // Add this input property for existing stops
  @Output() sitesSelected = new EventEmitter<any[]>();
  
  private map: any;
  private markers: { [key: number]: any } = {}; // To store markers by site ID
  private routeLine: any = null; // To store the route polyline
  selectedSites: any[] = []; // Stores selected sites with their order and duration
  tempSelectedSite: any = null; // Temporarily holds a site before confirming its position
  routePoints: L.LatLngExpression[] = []; // To store route points for the polyline
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['heritageSites'] && this.map && this.heritageSites.length > 0) {
      this.addSiteMarkers();
    }
    
    // Initialize with existing stops when editing an itinerary
    if (changes['initialSelectedSites'] && changes['initialSelectedSites'].currentValue && 
        changes['initialSelectedSites'].currentValue.length > 0) {
      this.selectedSites = [...changes['initialSelectedSites'].currentValue];
      
      // Update markers and route if map is initialized
      if (this.map) {
        // Update marker appearances for all selected sites
        this.selectedSites.forEach(site => {
          this.updateMarkerToSelected(site);
        });
        
        // Draw the route connecting all selected sites
        this.updateRouteOnMap();
      }
    }
  }
  
  private initMap() {
    try {
      // Set the default icon for all markers
      L.Marker.prototype.options.icon = iconDefault;
      
      this.map = L.map('heritage-map').setView([36.8065, 10.1815], 13); // Default to Tunis center
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
      }).addTo(this.map);
      
      // Add markers after map is initialized
      if (this.heritageSites.length > 0) {
        this.addSiteMarkers();
      }
      
      // Force a resize of the map after it's loaded to fix display issues
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
  
  private addSiteMarkers() {
    // Clear existing markers first
    Object.values(this.markers).forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = {};
    
    // Add a marker for each heritage site
    this.heritageSites.forEach(site => {
      try {
        if (site.location) {
          const [lat, lng] = site.location.split(',').map(coord => parseFloat(coord.trim()));
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng])
              .bindPopup(`
                <strong>${site.name}</strong><br>
                ${site.description?.substring(0, 100) || 'No description'}...<br>
                <button class="popup-add-btn" data-site-id="${site.id}">Add to Itinerary</button>
              `)
              .addTo(this.map);
            
            // Store the marker reference
            this.markers[site.id] = marker;
            
            // Add click handler using the marker
            marker.on('click', (e: any) => {
              // Check if site is already selected
              const isAlreadySelected = this.selectedSites.some(s => s.id === site.id);
              if (!isAlreadySelected) {
                this.prepareSiteForSelection(site);
              }
            });
            
            // Add popup event handler for the Add button
            marker.getPopup().on('add', (event: any) => {
              setTimeout(() => {
                const addBtn = document.querySelector(`.popup-add-btn[data-site-id="${site.id}"]`);
                if (addBtn) {
                  addBtn.addEventListener('click', () => {
                    const isAlreadySelected = this.selectedSites.some(s => s.id === site.id);
                    if (!isAlreadySelected) {
                      this.prepareSiteForSelection(site);
                      marker.closePopup();
                    }
                  });
                }
              }, 0);
            });
          }
        }
      } catch (error) {
        console.error(`Error adding marker for site ${site.id}:`, error);
      }
    });
    
    // If we have selected sites, draw the route
    if (this.selectedSites.length > 0) {
      this.updateRouteOnMap();
    }
  }
  
  prepareSiteForSelection(site: Site) {
    // Check if the site is already in the selected sites
    const siteAlreadySelected = this.selectedSites.some(
      selectedSite => selectedSite.id === site.id || selectedSite.heritageSite?.id === site.id
    );
    
    if (siteAlreadySelected) {
      // Site already exists in the itinerary - show an error message
      alert('This heritage site is already part of your itinerary.');
      return;
    }
    
    // Store temporarily and let user choose position
    this.tempSelectedSite = {
      ...site,
      duration: '1 day',
      durationDays: 1
    };
  }
  
  confirmAddSite(position: 'start' | 'middle' | 'end') {
    if (!this.tempSelectedSite) return;
    
    // Format duration - just use the number without 'day' or 'days'
    const days = this.tempSelectedSite.durationDays;
    this.tempSelectedSite.duration = `${days}`;
    
    // Find the min and max order values from existing stops
    let minOrder = 0;
    let maxOrder = 0;
    
    if (this.selectedSites.length > 0) {
      // Get the actual min and max order values from existing stops
      minOrder = Math.min(...this.selectedSites.map(site => site.order || 0));
      maxOrder = Math.max(...this.selectedSites.map(site => site.order || 0));
    }
    
    // Determine the position to insert and set the appropriate order
    if (position === 'start') {
      // Insert at the beginning with an order less than the minimum (or 0 if empty)
      this.tempSelectedSite.order = minOrder > 0 ? minOrder - 1 : 0;
      this.selectedSites.unshift(this.tempSelectedSite);
    } else if (position === 'end') {
      // Insert at the end with an order greater than the maximum
      this.tempSelectedSite.order = maxOrder + 1;
      this.selectedSites.push(this.tempSelectedSite);
    } else if (position === 'middle' && this.selectedSites.length >= 2) {
      // If we have at least two stops, find a middle order value
      // Sort the sites by order first
      const sortedSites = [...this.selectedSites].sort((a, b) => (a.order || 0) - (b.order || 0));
      const middleIndex = Math.floor(sortedSites.length / 2);
      
      // Get the order values of the stops before and after the middle
      const beforeOrder = sortedSites[middleIndex - 1].order || 0;
      const afterOrder = sortedSites[middleIndex].order || 0;
      
      // Set the new stop's order between these two values
      this.tempSelectedSite.order = beforeOrder + ((afterOrder - beforeOrder) / 2);
      
      // Insert the site at the correct position in the sorted array
      let insertIndex = this.selectedSites.findIndex(site => (site.order || 0) > this.tempSelectedSite.order);
      if (insertIndex === -1) insertIndex = this.selectedSites.length;
      this.selectedSites.splice(insertIndex, 0, this.tempSelectedSite);
    } else {
      // If there's only one or no stops, just add it at the end
      this.tempSelectedSite.order = maxOrder + 1;
      this.selectedSites.push(this.tempSelectedSite);
    }
    
    // Update all order values to ensure they're sequential and clean
    this.updateAllOrders();
    
    // Update marker appearance
    this.updateMarkerToSelected(this.tempSelectedSite);
    
    // Draw route on map
    this.updateRouteOnMap();
    
    // Clear the temp selection
    this.tempSelectedSite = null;
    
    // Emit the updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  cancelAddSite() {
    this.tempSelectedSite = null;
  }
  
  moveStop(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index > 0) {
      // Swap with the previous element
      [this.selectedSites[index], this.selectedSites[index - 1]] = 
      [this.selectedSites[index - 1], this.selectedSites[index]];
    } else if (direction === 'down' && index < this.selectedSites.length - 1) {
      // Swap with the next element
      [this.selectedSites[index], this.selectedSites[index + 1]] = 
      [this.selectedSites[index + 1], this.selectedSites[index]];
    }
    
    // Update all order values
    this.updateAllOrders();
    
    // Update the route on the map
    this.updateRouteOnMap();
    
    // Emit the updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  updateAllOrders() {
    // Sort the selected sites by their current order
    this.selectedSites.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // If we're editing an existing itinerary, we want to maintain relative ordering
    // while ensuring no duplicate order values
    const hasExistingOrders = this.selectedSites.some(site => site.order !== undefined);
    
    if (hasExistingOrders) {
      // Make sure there are no duplicate order values
      // but try to maintain the original spacing between stops
      const orderSet = new Set();
      
      // First pass: identify duplicates and maintain spacing where possible
      for (let i = 0; i < this.selectedSites.length; i++) {
        const site = this.selectedSites[i];
        
        // If order is missing or a duplicate, assign a new one
        if (site.order === undefined || orderSet.has(site.order)) {
          // Find an available order value
          let newOrder = i;
          while (orderSet.has(newOrder)) {
            newOrder += 0.1; // Use a decimal to avoid collisions
          }
          site.order = newOrder;
        }
        
        orderSet.add(site.order);
      }
      
      // Second pass: clean up decimal values if needed
      if (this.selectedSites.some(site => !Number.isInteger(site.order))) {
        // Re-sort after potential changes
        this.selectedSites.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Assign clean integer values while maintaining order
        this.selectedSites.forEach((site, i) => {
          site.order = i;
        });
      }
    } else {
      // If we don't have any existing orders, just use sequential numbering
      this.selectedSites.forEach((site, i) => {
        site.order = i;
      });
    }
  }
  
  updateMarkerToSelected(site: any) {
    if (this.markers[site.id]) {
      this.map.removeLayer(this.markers[site.id]);
      
      // Create a new marker with different icon to show it's selected
      const [lat, lng] = site.location.split(',').map((coord: string) => parseFloat(coord.trim()));
      const marker = L.marker([lat, lng], { icon: selectedIcon })
        .bindPopup(`
          <strong>${site.name}</strong><br>
          <em>Added to itinerary as stop #${site.order + 1}</em><br>
          <strong>Duration: ${site.duration}</strong>
        `)
        .addTo(this.map);
      
      this.markers[site.id] = marker;
    }
  }
  
  updateRouteOnMap() {
    // Clear previous route if it exists
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }
    
    // If there are at least 2 stops, draw a route
    if (this.selectedSites.length >= 2) {
      // Extract the lat/lng for each selected site in order
      this.routePoints = this.selectedSites
        .sort((a, b) => a.order - b.order)
        .map(site => {
          const [lat, lng] = site.location.split(',').map((coord: string) => parseFloat(coord.trim()));
          return L.latLng(lat, lng);
        });
      
      // Create a polyline connecting all the stops
      this.routeLine = L.polyline(this.routePoints, {
        color: 'blue',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'  // Makes the line dashed
      }).addTo(this.map);
      
      // Fit map bounds to show the entire route
      this.map.fitBounds(L.latLngBounds(this.routePoints).pad(0.2));
    }
  }
  
  removeSite(index: number) {
    const removedSite = this.selectedSites[index];
    
    // Remove the site from selected sites
    this.selectedSites.splice(index, 1);
    
    // Update the order for remaining sites
    this.updateAllOrders();
    
    // Reset marker appearance
    if (this.markers[removedSite.id]) {
      this.map.removeLayer(this.markers[removedSite.id]);
      
      // Re-add with default marker icon
      const [lat, lng] = removedSite.location.split(',').map((coord: string) => parseFloat(coord.trim()));
      const marker = L.marker([lat, lng])
        .bindPopup(`
          <strong>${removedSite.name}</strong><br>
          ${removedSite.description?.substring(0, 100) || 'No description'}...<br>
          <button class="popup-add-btn" data-site-id="${removedSite.id}">Add to Itinerary</button>
        `)
        .addTo(this.map);
      
      // Re-add click handlers
      marker.on('click', (e: any) => {
        const isAlreadySelected = this.selectedSites.some(s => s.id === removedSite.id);
        if (!isAlreadySelected) {
          this.prepareSiteForSelection(removedSite);
        }
      });
      
      // Add popup event handler for the Add button
      marker.getPopup().on('add', (event: any) => {
        setTimeout(() => {
          const addBtn = document.querySelector(`.popup-add-btn[data-site-id="${removedSite.id}"]`);
          if (addBtn) {
            addBtn.addEventListener('click', () => {
              const isAlreadySelected = this.selectedSites.some(s => s.id === removedSite.id);
              if (!isAlreadySelected) {
                this.prepareSiteForSelection(removedSite);
                marker.closePopup();
              }
            });
          }
        }, 0);
      });
      
      this.markers[removedSite.id] = marker;
    }
    
    // Update the route on the map
    this.updateRouteOnMap();
    
    // Emit the updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  updateDuration(index: number, event: any) {
    // Get the input value
    const days = this.selectedSites[index].durationDays;
    
    // Validate the input
    if (days && !isNaN(days) && days > 0) {
      // Update the duration string format
      this.selectedSites[index].duration = `${days}`;
      
      // Update visual indication
      this.updateMarkerPopup(this.selectedSites[index]);
    } else {
      // Fallback to default 1 day if input is invalid
      this.selectedSites[index].durationDays = 1;
      this.selectedSites[index].duration = '1';
      
      // Update visual indication
      this.updateMarkerPopup(this.selectedSites[index]);
    }
    
    // Emit updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  // Updates the popup content when duration changes
  private updateMarkerPopup(site: any) {
    if (this.markers[site.id]) {
      this.map.removeLayer(this.markers[site.id]);
      
      // Re-create the marker with updated duration
      const [lat, lng] = site.location.split(',').map((coord: string) => parseFloat(coord.trim()));
      const marker = L.marker([lat, lng], { icon: selectedIcon })
        .bindPopup(`
          <strong>${site.name}</strong><br>
          <em>Added to itinerary as stop #${site.order + 1}</em><br>
          <strong>Duration: ${site.duration}</strong>
        `)
        .addTo(this.map);
      
      this.markers[site.id] = marker;
    }
  }
}
