import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Site } from '../Models/site';
import { Observable, forkJoin, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private apiUrl = 'http://localhost:9090/api/Sites'; // Adjust if your backend runs elsewhere

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
          this.http.get<number>(`http://localhost:9090/api/reviews/heritage-site/${site.id}/average-rating`).pipe(
            map(rating => ({
              ...site,
              averageRating: rating || 0 // Default to 0 if no rating
            }))
          )
        );
        return forkJoin(requests);
      })
    );
  }

}
