import * as L from 'leaflet';

export class MapIconService {
  static getDefaultIcon() {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
  }

  static getSelectedIcon() {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [30, 46], // Slightly larger
      iconAnchor: [15, 46],
      popupAnchor: [1, -34],
      className: 'selected-marker-icon' // We'll add a CSS class for styling
    });
  }

  static getEventIcon() {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      className: 'event-marker-icon' // We'll add CSS classes for styling
    });
  }

  static getBusinessIcon() {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      className: 'business-marker-icon' // We'll add CSS classes for styling
    });
  }

  static getHeritageIcon() {
    return L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      className: 'heritage-marker-icon' // We'll add CSS classes for styling
    });
  }
}
