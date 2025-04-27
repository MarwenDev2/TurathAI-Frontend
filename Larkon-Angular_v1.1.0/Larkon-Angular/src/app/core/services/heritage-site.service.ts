import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeritageSite } from '../Models/heritage-site';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeritageSiteService {
  private apiUrl = 'http://localhost:9090/api/heritage-sites'; // Adjust if your backend runs elsewhere

  constructor(private http: HttpClient) {}

  getAll(): Observable<HeritageSite[]> {
    return this.http.get<HeritageSite[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<HeritageSite> {
    return this.http.get<HeritageSite>(`${this.apiUrl}/get/${id}`);
  }

  add(site: HeritageSite): Observable<HeritageSite> {
    return this.http.post<HeritageSite>(`${this.apiUrl}/add`, site);
  }

  update(site: HeritageSite): Observable<HeritageSite> {
    return this.http.put<HeritageSite>(`${this.apiUrl}/update`, site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`);
  }
}
