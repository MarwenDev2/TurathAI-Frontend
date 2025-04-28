import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, retry, tap } from 'rxjs';
import { UserPreferences } from '@core/Models/user-preferences';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {
  private apiUrl = 'http://localhost:9090/api/user-preferences';

  constructor(private http: HttpClient) { }

  getUserPreferencesByUserId(userId: number): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUrl}/user/${userId}`);
  }

  createUserPreferences(preferences: any): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(this.apiUrl, preferences).pipe(
        retry(2),
        tap(response => console.log('Preferences created:', response)),
        catchError(error => {
            console.error('Error creating preferences:', error);
            throw error;
        })
    );
}

updateUserPreferences(id: number, preferences: any): Observable<UserPreferences> {
    return this.http.put<UserPreferences>(`${this.apiUrl}/${id}`, preferences).pipe(
        catchError(error => {
            console.error('Error updating preferences:', error);
            throw error;
        })
    );
}

  deleteUserPreferences(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}