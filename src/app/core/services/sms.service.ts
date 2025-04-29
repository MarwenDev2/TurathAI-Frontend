import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stop } from '../Models/stop';
import { Itinery } from '../Models/itinerary';

interface SmsResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private apiUrl = 'http://localhost:9090/api/sms'; // Adjust this URL to match your backend API

  constructor(private http: HttpClient) { }

  sendStopNotification(stop: Stop, itinerary: Itinery, phoneNumber: string): Observable<SmsResponse> {
    const message = `New stop added to your itinerary "${itinerary.description}":\n` +
                   `Duration: ${stop.duration}\n` +
                   `Order: ${stop.order}`;
    
    return this.http.post<SmsResponse>(`${this.apiUrl}/send`, {
      message,
      itineraryId: itinerary.id,
      phoneNumber
    });
  }
} 