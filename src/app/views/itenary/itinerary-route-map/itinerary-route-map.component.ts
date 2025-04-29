import { Component, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Stop } from '@core/Models/stop';
import { Site } from '@core/Models/site';

// Explicitly import and extend the Leaflet types to avoid TypeScript errors
declare module 'leaflet' {
  interface LatLngExpression {
    lat: number;
    lng: number;
  }
}

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
  selector: 'app-itinerary-route-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Itinerary Route Map</h5>
      </div>
      <div class="card-body">
        <div id="route-map" style="height: 500px; width: 100%;"></div>
        <div class="mt-3">
          <p *ngIf="stops.length === 0" class="text-muted text-center">
            No stops have been added to this itinerary yet.
          </p>
          <div *ngIf="stops.length > 0">
            <h6>Itinerary Stops ({{ stops.length }} stops)</h6>
            <div class="list-group">
              <div *ngFor="let stop of stops" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">
                    <span class="badge bg-primary me-2">{{ stop.order }}</span>
                    {{ stop.heritageSite?.name || 'Unknown Location' }}
                  </h6>
                  <small>{{ stop.duration }}</small>
                </div>
                <p class="mb-1 text-muted small" *ngIf="stop.heritageSite?.description">
                  {{ stop.heritageSite?.description?.substring(0, 100) }}...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ItineraryRouteMapComponent implements OnChanges, AfterViewInit {
  @Input() stops: Stop[] = [];
  
  private map: any | null = null;
  private markers: any[] = [];
  private routeLine: any | null = null;
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.displayStopsOnMap();
    }, 0);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stops'] && this.map) {
      this.displayStopsOnMap();
    }
  }
  
  private initMap(): void {
    try {
      // Set the default icon for all markers
      (L.Marker as any).prototype.options.icon = iconDefault;
      
      // Create the map with a default center
      this.map = L.map('route-map').setView([36.8065, 10.1815], 13);
      
      // Add the tile layer (map background)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      
      // Force a resize after initialization to fix display issues
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
  
  private displayStopsOnMap(): void {
    if (!this.map || this.stops.length === 0) return;
    
    // Clear existing markers and route
    this.clearMap();
    
    // Filter stops with valid locations
    const stopsWithLocation = this.stops
      .filter(stop => stop.heritageSite && stop.heritageSite.location)
      .sort((a, b) => a.order - b.order);
    
    if (stopsWithLocation.length === 0) return;
    
    // Collect coordinates for the route
    const routeCoords: any[] = [];
    
    // Add markers for each stop
    stopsWithLocation.forEach((stop, index) => {
      const site = stop.heritageSite as Site;
      if (site && site.location) {
        try {
          const [lat, lng] = site.location.split(',').map(coord => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            // Create custom marker icon based on the stop order
            const customIcon = this.createNumberedIcon(stop.order);
            
            // Create the marker
            const marker = L.marker([lat, lng], { icon: customIcon });
            if (this.map) {
              marker.addTo(this.map)
                .bindPopup(`
                  <div style="padding: 5px;">
                    <h3 style="margin: 0 0 5px 0; font-size: 16px;">Stop ${stop.order}: ${site.name}</h3>
                    <p style="margin: 0 0 5px 0; font-weight: bold;">Duration: <span style="color: #3388ff;">${stop.duration}</span></p>
                    <p style="margin: 0; font-size: 14px;">${site.description ? site.description.substring(0, 150) + '...' : 'No description available.'}</p>
                  </div>
                `, {
                  maxWidth: 300,
                  className: 'custom-popup'
                });
            }
            
            this.markers.push(marker);
            routeCoords.push([lat, lng]);
          }
        } catch (error) {
          console.error(`Error adding marker for stop ${stop.id}:`, error);
        }
      }
    });
    
    // Create route line if there are at least 2 points
    if (routeCoords.length >= 2 && this.map) {
      this.routeLine = L.polyline(routeCoords as any, {
        color: '#3388ff',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(this.map);
      
      // Add arrows along the route to indicate direction
      this.addRouteArrows(routeCoords);
      
      // Fit the map to show all stops
      this.map.fitBounds(L.latLngBounds(routeCoords as any), {
        padding: [50, 50] as [number, number],
        maxZoom: 13
      });
    } else if (routeCoords.length === 1 && this.map) {
      // If there's only one stop, center on it
      this.map.setView(routeCoords[0] as any, 13);
    }
  }
  
  private clearMap(): void {
    if (!this.map) return;
    
    // Remove existing markers
    this.markers.forEach(marker => {
      if (this.map) this.map.removeLayer(marker);
    });
    this.markers = [];
    
    // Remove existing route line
    if (this.routeLine && this.map) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }
  }
  
  private createNumberedIcon(number: number): any {
    // Adjust size based on number of digits
    const numDigits = number.toString().length;
    const width = numDigits === 1 ? 40 : numDigits === 2 ? 46 : 52;
    const height = 48; // Fixed height for the map pointer
    const fontSize = numDigits === 1 ? 16 : numDigits === 2 ? 14 : 12;
    
    // Create a Google Maps-style pointer marker with the number
    return L.divIcon({
      className: 'custom-map-pointer',
      html: `
        <div style="position: relative;">
          <div style="
            position: absolute;
            width: ${width}px;
            height: ${height}px;
            background-color: #3388ff;
            border: 2px solid white;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-weight: bold;
            font-size: ${fontSize}px;
            transform: translate(-50%, -100%);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">${number}</div>
          <div style="
            position: absolute;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid #3388ff;
            transform: translate(-50%, -11px);
          "></div>
        </div>
      `,
      iconSize: [width, height] as [number, number],
      iconAnchor: [width/2, height] as [number, number]
    });
  }
  
  private addRouteArrows(coordinates: any[]): void {
    // Add arrows to indicate direction
    if (coordinates.length < 2 || !this.map) return;
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i] as [number, number];
      const end = coordinates[i + 1] as [number, number];
      
      // Calculate midpoint for arrow
      const midLat = (start[0] + end[0]) / 2;
      const midLng = (start[1] + end[1]) / 2;
      
      // Calculate angle
      const angle = this.calculateAngle(start, end);
      
      // Add arrow marker at midpoint
      const arrowIcon = L.divIcon({
        className: 'arrow-icon',
        html: `<div style="transform: rotate(${angle}deg); color: #3388ff; font-size: 20px;">➔</div>`,
        iconSize: [20, 20] as [number, number],
        iconAnchor: [10, 10] as [number, number]
      });
      
      const arrowMarker = L.marker([midLat, midLng], { icon: arrowIcon }).addTo(this.map);
      this.markers.push(arrowMarker);
    }
  }
  
  private calculateAngle(start: [number, number], end: [number, number]): number {
    const latDiff = end[0] - start[0];
    const lngDiff = end[1] - start[1];
    return Math.atan2(lngDiff, latDiff) * 180 / Math.PI;
  }
}
