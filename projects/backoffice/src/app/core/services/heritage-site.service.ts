import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HeritageSite } from '@core/Models/heritageSite';

@Injectable({
  providedIn: 'root',
})
export class HeritageSiteService {
  private apiUrl = 'http://localhost:8080/Sites';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HeritageSite[]> {
    return this.http.get<HeritageSite[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<HeritageSite> {
    return this.http.get<HeritageSite>(`${this.apiUrl}/get/${id}`);
  }

  add(site: HeritageSite): Observable<HeritageSite> {
    return this.http.post<HeritageSite>(`${this.apiUrl}/addSite`, site);
  }

  update(site: HeritageSite): Observable<HeritageSite> {
    return this.http.put<HeritageSite>(`${this.apiUrl}/updateSite`, site);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
