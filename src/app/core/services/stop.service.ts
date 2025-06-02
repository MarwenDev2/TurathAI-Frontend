import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Stop } from '../Models/stop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StopService {
  private apiUrl = `${environment.apiUrl}/api/stops`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Stop> {
    return this.http.get<Stop>(`${this.apiUrl}/get/${id}`);
  }

  getByItineraryId(itineraryId: number): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.apiUrl}/itinerary/${itineraryId}`);
  }

  add(stop: any): Observable<Stop> {
    // Transform the data to match backend expectations
    const backendStop = this.transformToBackendFormat(stop);
    console.log('Sending to backend:', backendStop);
    return this.http.post<Stop>(`${this.apiUrl}/add`, backendStop);
  }

  update(stop: any): Observable<Stop> {
    // Transform the data to match backend expectations
    const backendStop = this.transformToBackendFormat(stop);
    console.log('Sending to backend:', backendStop);
    return this.http.put<Stop>(`${this.apiUrl}/update`, backendStop);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`);
  }

  reorderStops(stops: Stop[]): Observable<Stop[]> {
    // Transform each stop to match backend expectations
    const backendStops = stops.map(stop => {
      // Ensure each stop has the correct itineryId before transformation
      // If stop.itineryId doesn't exist but stop.itinery does, extract the ID
      if (!stop.itineryId && stop.itinery && stop.itinery.id) {
        stop.itineryId = stop.itinery.id;
      } else if (!stop.itineryId && !stop.itinery) {
        // If neither exists, this is a problem - log it
        console.error('Stop missing itinerary reference:', stop);
      }
      
      return this.transformToBackendFormat(stop);
    });
    
    console.log('Sending reordered stops to backend:', backendStops);
    return this.http.put<Stop[]>(`${this.apiUrl}/reorder`, backendStops);
  }

  // Helper method to transform frontend stop data to backend format
  private transformToBackendFormat(stop: any): any {
    // If the stop already has a properly formatted itinery object, just return a copy with the correct structure
    if (stop.itinery && typeof stop.itinery === 'object') {
      // Still create a new object to ensure we have the right structure
      const backendStop: any = {
        id: stop.id || 0,
        order: stop.order,
        duration: stop.duration,
        itinery: { id: Number(stop.itinery.id) }
      };
      
      // Add heritageSite if it exists
      if (stop.heritageSite && typeof stop.heritageSite === 'object') {
        backendStop.heritageSite = { id: Number(stop.heritageSite.id) };
      } else if (stop.heritageSiteId) {
        backendStop.heritageSite = { id: Number(stop.heritageSiteId) };
      }
      
      return backendStop;
    }
    
    // Create a new object with the expected backend structure
    const backendStop: any = {
      id: stop.id || 0,
      order: stop.order,
      duration: stop.duration
    };
    
    // Add itinery object if itineryId is provided
    if (stop.itineryId) {
      backendStop.itinery = { id: Number(stop.itineryId) };
    }
    
    // Add heritageSite object if heritageSiteId is provided
    if (stop.heritageSiteId) {
      backendStop.heritageSite = { id: Number(stop.heritageSiteId) };
    }
    
    return backendStop;
  }

  deleteByItineraryId(itineraryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/itinerary/${itineraryId}`);
  }

  getBySiteId(siteId: number): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.apiUrl}/site/${siteId}`);
  }
  
}
