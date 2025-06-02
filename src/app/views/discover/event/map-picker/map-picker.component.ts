import { Component, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { EventService } from '@core/services/event.service';
import { BusinessService } from '@core/services/business.service';
import { SiteService } from '@core/services/site.service';
import { MapIconService } from './map-icon-service';

// Fix for marker icons in Angular
L.Marker.prototype.options.icon = MapIconService.getDefaultIcon();

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements AfterViewInit, OnChanges {
  @Output() locationSelected = new EventEmitter<string>();
  @Input() initialCoordinates: string = '';
  @Input() displayType: 'event' | 'business' | 'heritage' = 'event';
  @Input() showAllLocationTypes: boolean = true;
  
  private map: any;
  private eventMarkers: any[] = [];
  private businessMarkers: any[] = [];
  private heritageMarkers: any[] = [];
  private currentSelectionMarker: any;
  coordinates = '';
  showLegend = true;
  
  constructor(
    private eventService: EventService,
    private businessService: BusinessService,
    private siteService: SiteService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      this.setInitialMarker();
      this.loadExistingLocations();
    }, 0);
  }
  
  loadExistingLocations() {
    if (!this.map) return;
    
    // Clear existing markers
    this.clearExistingMarkers();
    
    // Load all location types unless specifically disabled
    if (this.showAllLocationTypes || this.displayType === 'event') {
      this.loadEvents();
    }
    
    if (this.showAllLocationTypes || this.displayType === 'business') {
      this.loadBusinesses();
    }
    
    if (this.showAllLocationTypes || this.displayType === 'heritage') {
      this.loadHeritageSites();
    }
  }
  
  private loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        events.forEach(event => {
          if (event.location) {
            try {
              const [lat, lng] = event.location.split(',').map(coord => parseFloat(coord.trim()));
              if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], { icon: MapIconService.getEventIcon() })
                  .addTo(this.map)
                  .bindPopup(`<strong>Event:</strong> ${event.name}<br><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`);
                this.eventMarkers.push(marker);
              }
            } catch (error) {
              console.error('Error parsing event location:', error);
            }
          }
        });
      },
      error: (err) => console.error('Failed to load events', err)
    });
  }
  
  private loadBusinesses() {
    this.businessService.getAllBusinesses().subscribe({
      next: (businesses) => {
        businesses.forEach(business => {
          if (business.latitude && business.longitude) {
            try {
              // Make sure we handle both string and number types
              const lat = typeof business.latitude === 'string' ? parseFloat(business.latitude) : business.latitude;
              const lng = typeof business.longitude === 'string' ? parseFloat(business.longitude) : business.longitude;
              if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], { icon: MapIconService.getBusinessIcon() })
                  .addTo(this.map)
                  .bindPopup(`<strong>Business:</strong> ${business.name}<br><strong>Type:</strong> ${business.type}`);
                this.businessMarkers.push(marker);
              }
            } catch (error) {
              console.error('Error parsing business location:', error);
            }
          }
        });
      },
      error: (err) => console.error('Failed to load businesses', err)
    });
  }
  
  private loadHeritageSites() {
    this.siteService.getAll().subscribe({
      next: (sites) => {
        sites.forEach(site => {
          if (site.location) {
            try {
              const [lat, lng] = site.location.split(',').map(coord => parseFloat(coord.trim()));
              if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng], { icon: MapIconService.getHeritageIcon() })
                  .addTo(this.map)
                  .bindPopup(`<strong>Heritage Site:</strong> ${site.name}`);
                this.heritageMarkers.push(marker);
              }
            } catch (error) {
              console.error('Error parsing heritage site location:', error);
            }
          }
        });
      },
      error: (err) => console.error('Failed to load heritage sites', err)
    });
  }
  
  clearExistingMarkers() {
    // Remove event markers
    this.eventMarkers.forEach(marker => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.eventMarkers = [];
    
    // Remove business markers
    this.businessMarkers.forEach(marker => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.businessMarkers = [];
    
    // Remove heritage site markers
    this.heritageMarkers.forEach(marker => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.heritageMarkers = [];
  }
  

  
  private addLegendToMap() {
    const legendControl = L.control({ position: 'bottomright' });
    
    legendControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML = `
        <h6 class="mb-2">Map Legend</h6>
        <div class="legend-item selected">
          <div class="legend-color"></div>
          <span>Selected Location</span>
        </div>
        <div class="legend-item event">
          <div class="legend-color"></div>
          <span>Events</span>
        </div>
        <div class="legend-item business">
          <div class="legend-color"></div>
          <span>Businesses</span>
        </div>
        <div class="legend-item heritage">
          <div class="legend-color"></div>
          <span>Heritage Sites</span>
        </div>
      `;
      return div;
    };
    
    legendControl.addTo(this.map);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCoordinates'] && this.map) {
      this.setInitialMarker();
    }
  }

  private initMap() {
    try {
      this.map = L.map('map').setView([36.8065, 10.1815], 13); // Default to Tunis center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add a legend control to the map if enabled
      if (this.showLegend) {
        this.addLegendToMap();
      }

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.coordinates = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        this.locationSelected.emit(this.coordinates);
        
        // Remove previous selection marker if exists
        if (this.currentSelectionMarker) {
          this.map.removeLayer(this.currentSelectionMarker);
        }
        
        // Add the new marker with the selected icon
        this.currentSelectionMarker = L.marker([lat, lng], { icon: MapIconService.getSelectedIcon() }).addTo(this.map)
          .bindPopup(`<strong>Selected Location</strong><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          .openPopup();
      });

      // Force a resize of the map after it's loaded to fix display issues
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  copyToClipboard() {
    if (this.coordinates) {
      navigator.clipboard.writeText(this.coordinates)
        .then(() => {
          // You could add a toast notification here
          console.log('Coordinates copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  }

  private setInitialMarker() {
    if (this.initialCoordinates && this.map) {
      try {
        // Parse coordinates (format: "lat,lng")
        const [lat, lng] = this.initialCoordinates.split(',').map(coord => parseFloat(coord.trim()));
        
        if (!isNaN(lat) && !isNaN(lng)) {
          this.coordinates = this.initialCoordinates;
          
          // Remove existing selection marker if present
          if (this.currentSelectionMarker) {
            this.map.removeLayer(this.currentSelectionMarker);
          }
          
          // Add marker and center map
          this.currentSelectionMarker = L.marker([lat, lng], { icon: MapIconService.getSelectedIcon() }).addTo(this.map)
            .bindPopup(`<strong>Selected Location</strong><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`)
            .openPopup();
          
          this.map.setView([lat, lng], 13);
        }
      } catch (error) {
        console.error('Error setting initial marker:', error);
      }
    }
  }
}