import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '@core/Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserStatisticsService {
  private apiUrl = 'http://localhost:9090/api/users';

  constructor(private http: HttpClient) { }

  // Get user growth statistics
  getUserGrowth(): Observable<{months: string[], counts: number[]}> {
    return this.http.get<{month: string, count: number}[]>(`${this.apiUrl}/growth`).pipe(
      map(data => {
        const months = data.map(item => item.month);
        const counts = data.map(item => item.count);
        return {months, counts};
      })
    );
  }

  // Get user distribution by country
  getUsersByCountry(): Observable<{country: string, count: number}[]> {
    return this.http.get<{country: string, count: number}[]>(`${this.apiUrl}/by-country`);
  }
  // Get user role distribution
  getUserRoles(): Observable<{role: string, count: number}[]> {
    return this.http.get<{role: string, count: number}[]>(`${this.apiUrl}/by-role`);
  }

  // Get recent users
  getRecentUsers(limit: number = 5): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/recent?limit=${limit}`);
  }
}