import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
    [key: string]: string | undefined;
  };
  boundingbox: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private cache: Map<string, any> = new Map();

  constructor(private http: HttpClient) { }

  /**
   * Get location details from coordinates
   * @param latitude Latitude
   * @param longitude Longitude
   * @returns Observable with location details
   */
  getLocationFromCoordinates(latitude: number, longitude: number): Observable<any> {
    const cacheKey = `${latitude},${longitude}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }

    // Use Nominatim service for reverse geocoding (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

    return this.http.get<NominatimResponse>(url, {
      headers: { 'Accept-Language': 'en' }
    }).pipe(
      map(response => {
        const result = {
          city: response.address.city || response.address.town || response.address.village || response.address.state || 'Unknown',
          country: response.address.country || 'Unknown',
          display_name: response.display_name,
          address: response.address
        };
        
        // Store in cache
        this.cache.set(cacheKey, result);
        
        return result;
      }),
      catchError(error => {
        console.error('Error getting location details:', error);
        return of({ city: 'Unknown', country: 'Unknown', display_name: 'Unknown location', address: {} });
      })
    );
  }

  /**
   * Get formatted location (City, Country) from coordinates
   * @param coordinates String in format "latitude,longitude"
   * @returns Observable with formatted location string
   */
  getFormattedLocation(coordinates: string): Observable<string> {
    if (!coordinates || coordinates.trim() === '') {
      return of('Unknown location');
    }

    try {
      const [latitude, longitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return of('Invalid coordinates');
      }

      return this.getLocationFromCoordinates(latitude, longitude).pipe(
        map(location => `${location.city}, ${location.country}`)
      );
    } catch (error) {
      console.error('Error parsing coordinates:', error);
      return of('Invalid coordinates');
    }
  }
}
