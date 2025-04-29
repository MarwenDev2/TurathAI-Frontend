import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSite } from '../Models/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:9090/api/events';
  private imageApiUrl = 'http://localhost:9090/images';

  constructor(private http: HttpClient) { }

  // Event CRUD Operations
  getAllEvents(): Observable<EventSite[]> {
    return this.http.get<EventSite[]>(this.apiUrl);
  }
  getImageBaseUrl(): string {
    return this.imageApiUrl;
  }

  getEventById(id: number): Observable<EventSite> {
    return this.http.get<EventSite>(`${this.apiUrl}/${id}`);
  }

  createEvent(event: EventSite): Observable<EventSite> {
    const payload = {
      ...event,
      startDate: this.formatDate(event.startDate),
      endDate: this.formatDate(event.endDate),
      imageIds: event.imageIds || []
    };
    return this.http.post<EventSite>(this.apiUrl, payload);
  }

  updateEvent(id: number, event: EventSite): Observable<EventSite> {
    const payload = {
      ...event,
      startDate: this.formatDate(event.startDate),
      endDate: this.formatDate(event.endDate),
      imageIds: event.imageIds || []
    };
    return this.http.put<EventSite>(`${this.apiUrl}/${id}`, payload);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Statistics
  getEventCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
  
  getUpcomingEventCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/upcoming-count`);
  }

  // Image Operations
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.imageApiUrl}/upload`, formData);
  }

  getImageUrl(imageId: number): string {
    return `${this.imageApiUrl}/${imageId}`;
  }

  getImageMetadata(imageId: number): Observable<any> {
    return this.http.get(`${this.imageApiUrl}/${imageId}/metadata`);
  }

  getAllImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.imageApiUrl}/all`);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.imageApiUrl}/${imageId}`);
  }

  // Event-Image Relationship Management
  addImageToEvent(eventId: number, imageId: number): Observable<EventSite> {
    return this.http.post<EventSite>(`${this.apiUrl}/${eventId}/images`, { imageId });
  }

  removeImageFromEvent(eventId: number, imageId: number): Observable<EventSite> {
    return this.http.delete<EventSite>(`${this.apiUrl}/${eventId}/images/${imageId}`);
  }

  // Helper Methods
  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return date.toISOString();
  }

  // Utility method to handle image display
  getSanitizedImageUrl(imageId: number): string {
    return this.getImageUrl(imageId) + '?t=' + new Date().getTime(); // Cache buster
  }
}