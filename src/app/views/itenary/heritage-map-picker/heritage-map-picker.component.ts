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
    <div class="mt-3 mb-3">
      <h5>Selected Heritage Sites ({{ selectedSites.length }})</h5>
      <div *ngIf="selectedSites.length === 0" class="alert alert-info">
        Click on heritage sites on the map to add them to your itinerary.
      </div>
      <ul class="list-group">
        <li *ngFor="let site of selectedSites; let i = index" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <span class="badge bg-primary me-2">{{ i + 1 }}</span>
            <strong>{{ site.name }}</strong>
            <span class="badge bg-success ms-2">{{ site.durationDays }} day{{ site.durationDays > 1 ? 's' : '' }}</span> <!-- ADD THIS -->
          </div>
          <div class="d-flex align-items-center">
            <div class="input-group me-2" style="width: 200px;">
              <span class="input-group-text">Duration</span>
              <input 
                type="number" 
                min="1"
                class="form-control" 
                [(ngModel)]="site.durationDays" 
                placeholder="Number of days"
                (change)="updateDuration(i, $event)"
              >
              <span class="input-group-text">day(s)</span>
            </div>
            <button class="btn btn-danger btn-sm" (click)="removeSite(i)">
              <i class="fa fa-trash"></i> <!-- SMALL CHANGE: use 'fa-trash' instead of 'fa-times' -->
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
  @Output() sitesSelected = new EventEmitter<any[]>();
  
  private map: any;
  private markers: { [key: number]: any } = {}; // To store markers by site ID
  selectedSites: any[] = []; // Stores selected sites with their order and duration
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['heritageSites'] && this.map && this.heritageSites.length > 0) {
      this.addSiteMarkers();
    }
  }
  
  
  private initMap() {
    try {
      // Set the default icon for all markers
      L.Marker.prototype.options.icon = iconDefault;
      
      this.map = L.map('heritage-map').setView([36.8065, 10.1815], 13); // Default to Tunis center
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
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
                ${site.description.substring(0, 100)}...<br>
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
                this.addSiteToSelection(site);
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
                      this.addSiteToSelection(site);
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
  }
  
  addSiteToSelection(site: Site) {
    // Add site to selected sites with default 1 day duration
    const siteWithDuration = {
      ...site,
      duration: '1 day',
      durationDays: 1,
      order: this.selectedSites.length + 1
    };
    
    this.selectedSites.push(siteWithDuration);
    
    // Update marker appearance to show it's selected
    if (this.markers[site.id]) {
      this.map.removeLayer(this.markers[site.id]);
      
      // Create a new marker with different icon to show it's selected
      const [lat, lng] = site.location.split(',').map(coord => parseFloat(coord.trim()));
      const marker = L.marker([lat, lng], { icon: selectedIcon })
        .bindPopup(`
          <strong>${site.name}</strong><br>
          <em>Added to itinerary as stop #${siteWithDuration.order}</em><br>
          <strong>Duration: ${siteWithDuration.duration}</strong>
        `)
        .addTo(this.map);
      
      this.markers[site.id] = marker;
    }
    
    // Emit the updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  removeSite(index: number) {
    const removedSite = this.selectedSites[index];
    
    // Remove the site from selected sites
    this.selectedSites.splice(index, 1);
    
    // Update the order for remaining sites
    this.selectedSites.forEach((site, i) => {
      site.order = i + 1;
    });
    
    // Reset marker appearance
    if (this.markers[removedSite.id]) {
      this.map.removeLayer(this.markers[removedSite.id]);
      
      // Re-add with default marker icon
      const [lat, lng] = removedSite.location.split(',').map((coord: string) => parseFloat(coord.trim()));
      const marker = L.marker([lat, lng])
        .bindPopup(`
          <strong>${removedSite.name}</strong><br>
          ${removedSite.description.substring(0, 100)}...<br>
          <button class="popup-add-btn" data-site-id="${removedSite.id}">Add to Itinerary</button>
        `)
        .addTo(this.map);
      
      // Re-add click handlers
      marker.on('click', (e: any) => {
        const isAlreadySelected = this.selectedSites.some(s => s.id === removedSite.id);
        if (!isAlreadySelected) {
          this.addSiteToSelection(removedSite);
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
                this.addSiteToSelection(removedSite);
                marker.closePopup();
              }
            });
          }
        }, 0);
      });
      
      this.markers[removedSite.id] = marker;
    }
    
    // Emit the updated selection
    this.sitesSelected.emit(this.selectedSites);
  }
  
  updateDuration(index: number, event: any) {
    // Get the input value
    const days = this.selectedSites[index].durationDays;
    
    // Validate the input
    if (days && !isNaN(days) && days > 0) {
      // Update the duration string format
      this.selectedSites[index].duration = `${days} day${days !== 1 ? 's' : ''}`;
      
      // Update visual indication
      this.updateMarkerPopup(this.selectedSites[index]);
    } else {
      // Fallback to default 1 day if input is invalid
      this.selectedSites[index].durationDays = 1;
      this.selectedSites[index].duration = '1 day';
      
      // Update visual indication
      this.updateMarkerPopup(this.selectedSites[index]);
    }
    
    // Log the updated duration for debugging
    console.log(`Updated duration for site ${this.selectedSites[index].name} to ${this.selectedSites[index].duration}`);
    
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
          <em>Added to itinerary as stop #${site.order}</em><br>
          <strong>Duration: ${site.duration}</strong>
        `)
        .addTo(this.map);
      
      this.markers[site.id] = marker;
    }
  }
}
