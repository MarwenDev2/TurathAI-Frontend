import { Component, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

// Fix for marker icons in Angular
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
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

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="map" style="height: 400px; width: 100%;"></div>
    <div class="mt-2">
      <p class="mb-1">Selected Location:</p>
      <div class="input-group">
        <input type="text" class="form-control" [value]="coordinates" readonly>
        <button class="btn btn-outline-secondary" type="button" (click)="copyToClipboard()">
          Copy
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class MapPickerComponent implements AfterViewInit, OnChanges {
  @Output() locationSelected = new EventEmitter<string>();
  @Input() initialCoordinates: string = '';
  private map: any;
  private marker: any;
  coordinates = '';

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
      this.setInitialMarker();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialCoordinates'] && this.map) {
      this.setInitialMarker();
    }
  }

  private initMap() {
    try {
      // Set the default icon for all markers
      L.Marker.prototype.options.icon = iconDefault;

      this.map = L.map('map').setView([36.8065, 10.1815], 13); // Default to Tunis center

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        this.coordinates = `${lat.toFixed(6)},${lng.toFixed(6)}`;
        this.locationSelected.emit(this.coordinates);
        
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }
        
        this.marker = L.marker([lat, lng]).addTo(this.map)
          .bindPopup(`Location: ${this.coordinates}`)
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
    navigator.clipboard.writeText(this.coordinates);
  }

  private setInitialMarker() {
    if (this.initialCoordinates && this.map) {
      try {
        // Parse coordinates (format: "lat,lng")
        const [lat, lng] = this.initialCoordinates.split(',').map(coord => parseFloat(coord.trim()));
        
        if (!isNaN(lat) && !isNaN(lng)) {
          this.coordinates = this.initialCoordinates;
          
          // Remove existing marker if present
          if (this.marker) {
            this.map.removeLayer(this.marker);
          }
          
          // Add marker and center map
          this.marker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup(`Location: ${this.coordinates}`)
            .openPopup();
          
          this.map.setView([lat, lng], 13);
        }
      } catch (error) {
        console.error('Error setting initial marker:', error);
      }
    }
  }
}