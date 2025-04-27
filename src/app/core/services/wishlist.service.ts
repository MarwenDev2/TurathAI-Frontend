
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  private apiUrl = 'http://localhost:8080/api/wishlist';

  constructor(private http: HttpClient) {}

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
