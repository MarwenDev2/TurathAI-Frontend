import { Component, Input, AfterViewInit, OnChanges, SimpleChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { timer } from 'rxjs';
import { Stop } from '@core/Models/stop';
import { Site } from '@core/Models/site';

// Custom checkpoint icons for stops
const startIconUrl = 'assets/marker-icon-green.png';
const middleIconUrl = 'assets/marker-icon-blue.png';
const endIconUrl = 'assets/marker-icon-red.png';
const shadowUrl = 'assets/marker-shadow.png';

// Define different icons for start, middle, and end points
const startIcon = L.icon({
  iconUrl: startIconUrl,
  iconRetinaUrl: startIconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const middleIcon = L.icon({
  iconUrl: middleIconUrl,
  iconRetinaUrl: middleIconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const endIcon = L.icon({
  iconUrl: endIconUrl,
  iconRetinaUrl: endIconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Fallback icon in case custom icons fail to load
const defaultIcon = L.icon({
  iconUrl: 'assets/marker-icon.png',
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

@Component({
  selector: 'app-stop-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [attr.id]="mapId" class="itinerary-stops-map"></div>
  `,
  styles: [`
    .itinerary-stops-map {
      height: 200px;
      width: 100%;
      border-radius: 8px;
      margin-top: 10px;
      margin-bottom: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class StopMapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() stops: Stop[] = [];
  @Input() itineraryId: number = 0;
  private map: any;
  private markers: any[] = [];
  private routePath: any;
  mapId: string = '';
  private mapInitialized = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Set the map ID during initialization to avoid ExpressionChangedAfterItHasBeenCheckedError
    this.mapId = 'stopsMap_' + (this.itineraryId || Math.floor(Math.random() * 10000));
    // Mark for check to ensure Angular updates the DOM
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Use timer to ensure the DOM is ready
    timer(100).subscribe(() => {
      // Only initialize if not already done
      if (!this.mapInitialized) {
        this.initMap();
        this.addStopMarkers();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stops'] && this.map) {
      this.updateMarkers();
    }

    // Handle itineraryId changes
    if (changes['itineraryId'] && !this.mapInitialized) {
      // Update map ID if it hasn't been initialized yet
      this.mapId = 'stopsMap_' + (this.itineraryId || Math.floor(Math.random() * 10000));
      this.cdr.detectChanges();
    }
  }

  private initMap() {
    try {
      const mapContainer = document.getElementById(this.mapId);
      
      if (!mapContainer) {
        console.error(`Map container with id '${this.mapId}' not found`);
        return;
      }
      
      // Create the map instance
      this.map = L.map(this.mapId).setView([36.8065, 10.1815], 13); // Default to Tunis center
      this.mapInitialized = true;

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Force a resize of the map after it's loaded to fix display issues
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private updateMarkers() {
    // Clear existing markers
    this.clearMarkers();
    // Add markers for current stops
    this.addStopMarkers();
  }

  private clearMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach(marker => {
        if (this.map) {
          this.map.removeLayer(marker);
        }
      });
      this.markers = [];
    }
  }

  private addStopMarkers() {
    if (!this.map || !this.stops || this.stops.length === 0) {
      return;
    }

    const bounds = L.latLngBounds([]);
    let hasValidMarkers = false;
    const validStops: Stop[] = [];
    const routePoints: [number, number][] = [];

    // Sort stops by order to ensure correct sequence
    const sortedStops = [...this.stops].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    sortedStops.forEach((stop, index) => {
      if (stop.heritageSite && this.isValidLocation(stop.heritageSite.location)) {
        try {
          // Parse coordinates (format: "lat,lng")
          const [lat, lng] = stop.heritageSite.location.split(',').map(coord => parseFloat(coord.trim()));
          
          if (!isNaN(lat) && !isNaN(lng)) {
            // Create checkpoint HTML content for the popup
            const popupContent = `
              <div class="checkpoint-popup">
                <strong>${stop.heritageSite.name || 'Heritage Site'}</strong>
                <p><b>Checkpoint #${stop.order}</b></p>
                <p><i class="fa fa-clock-o"></i> Duration: ${stop.duration}</p>
                ${stop.heritageSite.description ? `<p>${stop.heritageSite.description.substring(0, 100)}${stop.heritageSite.description.length > 100 ? '...' : ''}</p>` : ''}
              </div>
            `;
            
            // Select appropriate icon based on position in route
            let icon;
            if (index === 0) {
              icon = startIcon;
            } else if (index === sortedStops.length - 1) {
              icon = endIcon;
            } else {
              icon = middleIcon;
            }
            
            // Create marker with chosen icon
            const marker = L.marker([lat, lng], { icon: icon }).addTo(this.map)
              .bindPopup(popupContent);
            
            // Add checkpoint number as marker label
            marker.bindTooltip(stop.order.toString(), {
              permanent: true,
              direction: 'center',
              className: 'checkpoint-label'
            });
            
            this.markers.push(marker);
            validStops.push(stop);
            routePoints.push([lat, lng]);
            bounds.extend([lat, lng]);
            hasValidMarkers = true;
          }
        } catch (error) {
          console.error('Error adding marker for stop:', stop, error);
        }
      }
    });
    
    // Draw route path connecting the checkpoints
    if (routePoints.length >= 2) {
      // Remove existing path if any
      if (this.routePath) {
        this.map.removeLayer(this.routePath);
      }
      
      // Create a polyline connecting all points
      this.routePath = L.polyline(routePoints, {
        color: '#3388ff',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(this.map);
    }

    // Fit bounds if we have valid markers
    if (hasValidMarkers) {
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }

  private isValidLocation(location: string | undefined): boolean {
    if (!location) return false;
    
    try {
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      return !isNaN(lat) && !isNaN(lng);
    } catch {
      return false;
    }
  }
}
