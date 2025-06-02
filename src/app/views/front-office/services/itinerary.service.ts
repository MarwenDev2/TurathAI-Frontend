import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Itinerary {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  userId?: number;
  title?: string;
  imageUrl?: string;
  locations?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private apiUrl = `${environment.apiUrl}/api/itineries`;

  constructor(private http: HttpClient) { }

  // Get API URL for debugging purposes
  getApiUrl(): string {
    return this.apiUrl;
  }

  // Get all itineraries
  getAllItineraries(): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  // Get itinerary by ID
  getItineraryById(id: number): Observable<Itinerary> {
    return this.http.get<Itinerary>(`${this.apiUrl}/get/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new itinerary
  createItinerary(itinerary: Partial<Itinerary>): Observable<Itinerary> {
    return this.http.post<Itinerary>(`${this.apiUrl}/add`, itinerary).pipe(
      catchError(this.handleError)
    );
  }

  // Update existing itinerary
  updateItinerary(itinerary: Partial<Itinerary>): Observable<Itinerary> {
    return this.http.put<Itinerary>(`${this.apiUrl}/update`, itinerary).pipe(
      catchError(this.handleError)
    );
  }

  // Delete itinerary
  deleteItinerary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get QR code for an itinerary
  getQRCode(id: number): string {
    return `${environment.apiUrl}/api/qrcode/itinery/${id}`;
  }

  // Error handling method
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', error.error);
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error('Server-side error:', error);
    }
    
    return throwError(() => new Error(errorMessage));
  }


// Assign an itinerary to a user
assignItineraryToUser(itineraryId: number, userId: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/assign`, { itineraryId, userId }).pipe(
    catchError(this.handleError)
  );
}

// Remove itinerary from user
removeItineraryFromUser(itineraryId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/unassign/${itineraryId}`).pipe(
    catchError(this.handleError)
  );
}


  getItinerariesBySiteId(siteId: number): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/site/${siteId}`, {
      responseType: 'json'
    } as const).pipe(
      catchError(this.handleError)
    );
  }
  
  getItinerariesByUserId(userId: number): Observable<Itinerary[]> {
    return this.http.get<Itinerary[]>(`${this.apiUrl}/user/${userId}`, {
      responseType: 'json'
    } as const).pipe(
      catchError(this.handleError)
    );
  }
  
  
} 