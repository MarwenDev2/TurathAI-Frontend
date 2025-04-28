import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map, switchMap, of } from 'rxjs';
import { Review } from '../Models/review';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:9090';
  private apiUrl = `${this.baseUrl}/api/reviews`;

  constructor(private http: HttpClient) { }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addReview(review: Review): Observable<string> {
    return this.http.post<string>(this.apiUrl, review).pipe(
      catchError(this.handleError)
    );
  }

  updateReview(id: number, review: Review): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review).pipe(
      catchError(this.handleError)
    );
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getReviewsByHeritageSite(siteId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/heritage-site/${siteId}`).pipe(
      catchError(this.handleError)
    );
  }

  getReviewsByUser(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  calculateAverageRating(siteId: number): Observable<{ average: number, hasReviews: boolean }> {
    return this.getReviewsByHeritageSite(siteId).pipe(
      switchMap(reviews => {
        if (reviews.length === 0) {
          return of({ average: 0, hasReviews: false });
        }
        return this.http.get<number>(`${this.apiUrl}/heritage-site/${siteId}/average-rating`).pipe(
          map(avg => ({ average: avg, hasReviews: true })),
          catchError(err => {
            console.error(`Error fetching average rating for site ${siteId}:`, err);
            return of({ average: 0, hasReviews: true }); // Assume there are reviews since we got past the length check
          })
        );
      }),
      catchError(err => {
        console.error(`Error fetching reviews for site ${siteId}:`, err);
        return of({ average: 0, hasReviews: false });
      })
    );
  }

  getFlaggedReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/flagged`).pipe(
      catchError(this.handleError)
    );
  }

  getReviewsByRating(minRating: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/byRating/${minRating}`).pipe(
      catchError(this.handleError)
    );
  }

  searchReviews(keyword: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/bycomments`, { 
      params: { keyword } 
    }).pipe(
      catchError(this.handleError)
    );
  }

  removeUserReview(userId: number, siteId: number): Observable<string> {
    return this.http.delete<string>(
      `${this.apiUrl}/${userId}/heritage-site-remove/${siteId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  getReviewsByUserName(name: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/byUserName`, { params: { name } }).pipe(
      catchError(this.handleError)
    );
  }

  getReviewsWithFilters(
    heritageSiteId?: number,
    minRating?: number,
    userName?: string,
    keyword?: string
  ): Observable<Review[]> {
    let params = new HttpParams();
    if (heritageSiteId && heritageSiteId > 0) {
      params = params.set('heritageSiteId', heritageSiteId.toString());
    }
    if (minRating && minRating > 0) {
      params = params.set('minRating', minRating.toString());
    }
    if (userName && userName.trim()) {
      params = params.set('userName', userName.trim());
    }
    if (keyword && keyword.trim()) {
      params = params.set('keyword', keyword.trim());
    }
    return this.http.get<Review[]>(`${this.apiUrl}/filter`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong; please try again later.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
      if (error.status === 0) {
        errorMessage = 'Network error: Unable to reach the server. Please check if the backend is running.';
      }
    }
    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}