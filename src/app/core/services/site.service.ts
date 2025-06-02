import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Site } from '../Models/site';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private apiUrl = `${environment.apiUrl}/api/Sites`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.apiUrl}/get/${id}`);
  }

  add(site: Site): Observable<Site> {
    return this.http.post<any>(`${this.apiUrl}/addSite`, site).pipe(
      map(response => {
        if (response && response.body) {
          return response.body;
        } else if (response) {
          return response;
        }
        throw new Error('Failed to add heritage site');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding site:', error);
        throw new Error(error.error?.message || 'Failed to add heritage site');
      })
    );
  }

  update(Site: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/updateSite`, Site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getSiteCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  downloadExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/excel`, {
      responseType: 'blob'
    });
  }

  search(keyword: string): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/search`, {
      params: { keyword }
    });
  }

  
  sortSites(sites: Site[], sortBy: keyof Site, direction: 'asc' | 'desc'): Site[] {
    return [...sites].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      
      if (valA == null || valB == null) return 0;
  
      const result = typeof valA === 'string'
        ? valA.localeCompare(valB as string)
        : (valA < valB ? -1 : valA > valB ? 1 : 0);
  
      return direction === 'asc' ? result : -result;
    });
  }
  
  getAllWithRatings(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/all`).pipe(
      switchMap(sites => {
        const requests = sites.map(site => 
          this.http.get<number>(`${environment.apiUrl}/api/reviews/heritage-site/${site.id}/average-rating`).pipe(
            map(rating => {
              // Map average review ratings directly to popularity scores
              let newPopularityScore = site.popularityScore; // Default to current score
              
              // If there is a rating, update the popularity score based on rating
              if (rating !== undefined && rating !== null) {
                if (rating >= 1 && rating < 3) {
                  // Low reviews (1-2): Score = 3
                  newPopularityScore = 3;
                } else if (rating >= 3 && rating < 4) {
                  // Medium reviews (3): Score = 5
                  newPopularityScore = 5;
                } else if (rating >= 4 && rating <= 5) {
                  // High reviews (4-5): Score = 8
                  newPopularityScore = 8;
                }
              }
              
              return {
                ...site,
                averageRating: rating || 0, // Default to 0 if no rating
                popularityScore: newPopularityScore
              };
            })
          )
        );
        return forkJoin(requests);
      })
    );
  }
  
  // Method to check if a site needs maintenance (low popularity score and rating)
  getSitesNeedingMaintenance(sites: Site[]): Site[] {
    // Find sites with popularity score of 3 (low) and average rating less than 3
    return sites.filter(site => 
      site.popularityScore <= 3 && 
      site.averageRating !== undefined && site.averageRating < 3
    );
  }

}
