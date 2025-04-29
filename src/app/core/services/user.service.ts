import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user'
import { catchError, delay, Observable, of, retry, switchMap, throwError } from 'rxjs';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferences } from '@core/Models/user-preferences';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:9090/api/users'; // ✅ change this to match your backend endpoint
  userForm: any;

  constructor(private http: HttpClient, private userPreferencesService: UserPreferencesService) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(error => {
        console.error('Error adding user:', error);
        let errorMessage = 'Failed to create user';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  changePassword(userId: number, data: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/${userId}`, data);
  }

  getLanguageNames(arg0: any): string {
    throw new Error('Method not implemented.');
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        let errorMessage = 'Failed to update user';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Add this new method for partial updates
  updateUserInterests(id: number, currentUser: User, newInterests: string[]): Observable<User> {
    // Create a new user object with updated interests
    const updatedUser = {
      ...currentUser,
      interests: newInterests.join(', ')
    };
    
    return this.updateUser(id, updatedUser);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // In UserService
getCurrentUser(): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/me`).pipe(
    catchError(error => {
      console.error('Error fetching current user:', error);
      throw new Error('Failed to fetch user data');
    })
  );
}

// Upload profile image
uploadProfileImage(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/upload-image`, formData).pipe(
    catchError(error => {
      console.error('Error uploading profile image:', error);
      let errorMessage = 'Failed to upload profile image';
      
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
}

}
