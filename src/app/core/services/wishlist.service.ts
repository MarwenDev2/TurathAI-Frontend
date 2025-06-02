import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Wishlist } from '../Models/wishlist';


interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/api/wishlist`;

  constructor(private http: HttpClient) {}

  /**
   * Add a heritage site to the user's wishlist
   * @param userId The user ID
   * @param siteId The heritage site ID
   * @returns A message indicating success or failure
   */
  addToWishlist(userId: number, siteId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/add/${userId}/${siteId}`, {}, { responseType: 'text' }).pipe(
      catchError(err => {
        console.error('Error adding site to wishlist:', err);
        return throwError(() => new Error('Failed to add to wishlist'));
      })
    );
  }

  /**
   * Check if a heritage site is in the user's wishlist
   * @param userId The user ID
   * @param siteId The heritage site ID to check
   * @returns An Observable that resolves to true if the site is in the wishlist
   */
  isSiteInWishlist(userId: number, siteId: number): Observable<boolean> {
    return this.getWishlist(userId).pipe(
      map(wishlistItems => wishlistItems.some(item => item.heritageSite?.id === siteId)),
      catchError(err => {
        console.error('Error checking wishlist:', err);
        return throwError(() => new Error('Failed to check wishlist'));
      })
    );
  }

  // Fetch wishlist for a specific user
  getWishlist(userId: number): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(err => {
        console.error('Error fetching wishlist for user:', err);
        return throwError(() => new Error('Failed to fetch wishlist'));
      })
    );
  }

  getAllWishlists(
    searchTerm: string | null,
    startDate: string | null,
    endDate: string | null,
    page: number,
    size: number,
   
  ): Observable<Page<Wishlist>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate).set('endDate', endDate);
    }

    return this.http.get<Page<Wishlist>>(this.apiUrl, { params }).pipe(
      catchError(err => {
        console.error('Error fetching wishlists:', err);
        return throwError(() => new Error('Failed to fetch wishlists'));
      })
    );
  }

  removeWishlist(wishlistId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/remove/${wishlistId}`);
  }

  bulkRemoveWishlists(wishlistIds: number[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/bulk-remove`, wishlistIds);
  }

  exportWishlists(): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.apiUrl}/export`).pipe(
      catchError(err => {
        console.error('Error exporting wishlists:', err);
        return throwError(() => new Error('Failed to export wishlists'));
      })
    );
  }
}
