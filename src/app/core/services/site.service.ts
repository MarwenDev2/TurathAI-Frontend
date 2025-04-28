import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Site } from '../Models/site';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private apiUrl = 'http://localhost:9090/Sites'; // Adjust if your backend runs elsewhere

  constructor(private http: HttpClient) {}

  getAll(): Observable<Site[]> {
    return this.http.get<Site[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Site> {
    return this.http.get<Site>(`${this.apiUrl}/get/${id}`);
  }

  add(Site: Site): Observable<Site> {
    return this.http.post<Site>(`${this.apiUrl}/addSite`, Site);
  }

  update(Site: Site): Observable<Site> {
    return this.http.put<Site>(`${this.apiUrl}/updateSite`, Site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

}
