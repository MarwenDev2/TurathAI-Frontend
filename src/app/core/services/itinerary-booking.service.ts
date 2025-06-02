import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Itinery } from '@core/Models/itinerary';

@Injectable({
  providedIn: 'root'
})
export class ItineraryBookingService {
  private apiUrl = `${environment.apiUrl}/api/itineraries`;

  constructor(private http: HttpClient) { }

  /**
   * Book an itinerary by updating its user ID
   * @param itineraryId The itinerary ID to book
   * @param userId The user ID booking the itinerary
   */
  bookItinerary(itineraryId: number, userId: number): Observable<Itinery> {
    return this.http.put<Itinery>(`${this.apiUrl}/${itineraryId}/book/${userId}`, {}).pipe(
      catchError(err => {
        console.error('Error booking itinerary:', err);
        return throwError(() => new Error('Failed to book itinerary'));
      })
    );
  }

  /**
   * Get all itineraries booked by a user
   * @param userId The user ID
   */
  getUserItineraries(userId: number): Observable<Itinery[]> {
    return this.http.get<Itinery[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(err => {
        console.error('Error fetching user itineraries:', err);
        return throwError(() => new Error('Failed to fetch itineraries'));
      })
    );
  }
  
  /**
   * Cancel a booked itinerary by setting user ID back to null
   * @param itineraryId The itinerary ID
   */
  cancelItinerary(itineraryId: number): Observable<Itinery> {
    return this.http.put<Itinery>(`${this.apiUrl}/${itineraryId}/cancel`, {}).pipe(
      catchError(err => {
        console.error('Error canceling itinerary:', err);
        return throwError(() => new Error('Failed to cancel itinerary'));
      })
    );
  }

  /**
   * Get all available (unbooked) itineraries
   */
  getAvailableItineraries(): Observable<Itinery[]> {
    return this.http.get<Itinery[]>(`${this.apiUrl}/available`).pipe(
      catchError(err => {
        console.error('Error fetching available itineraries:', err);
        return throwError(() => new Error('Failed to fetch available itineraries'));
      })
    );
  }

  /**
   * Get itineraries categorized by date status (upcoming, current)
   * @param userId The user ID
   */
  getCategorizedItineraries(userId: number): Observable<{
    upcoming: Itinery[],
    current: Itinery[]
  }> {
    return this.getUserItineraries(userId).pipe(
      map(itineraries => {
        const now = new Date();
        
        // Categorize itineraries based on dates
        const upcoming = itineraries.filter(itinerary => {
          const startDate = new Date(itinerary.startDate);
          return startDate > now;
        });
        
        const current = itineraries.filter(itinerary => {
          const startDate = new Date(itinerary.startDate);
          const endDate = new Date(itinerary.endDate);
          return startDate <= now && endDate >= now;
        });
        
        return { upcoming, current };
      }),
      catchError(err => {
        console.error('Error categorizing itineraries:', err);
        return throwError(() => new Error('Failed to categorize itineraries'));
      })
    );
  }
}
