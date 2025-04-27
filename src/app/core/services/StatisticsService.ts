import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:8080/api/local-insights';

  constructor(private http: HttpClient) { }

  getInsightsByType(): Observable<any> {
    return this.http.get(`${this.apiUrl}/insights-by-type`);
  }
}