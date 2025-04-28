import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business } from '../Models/business';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private apiUrl = 'http://localhost:9090/api/businesses';
  private imageApiUrl = 'http://localhost:9090/images';

  constructor(private http: HttpClient) { }

  // Business CRUD Operations
  getAllBusinesses(): Observable<Business[]> {
    return this.http.get<Business[]>(this.apiUrl);
  }

  getImageBaseUrl(): string {
    return this.imageApiUrl;
  }

  getBusinessById(id: number): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/${id}`);
  }

  getBusinessesBySiteId(siteId: number): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.apiUrl}/by-site/${siteId}`);
  }

  createBusiness(business: Business): Observable<Business> {
    const payload = {
      ...business,
      imageIds: business.imageIds || []
    };
    return this.http.post<Business>(this.apiUrl, payload);
  }

  updateBusiness(id: number, business: Business): Observable<Business> {
    const payload = {
      ...business,
      imageIds: business.imageIds || []
    };
    return this.http.put<Business>(`${this.apiUrl}/${id}`, payload);
  }

  deleteBusiness(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Image Operations
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.imageApiUrl}/upload`, formData);
  }

  getImageUrl(imageId: number): string {
    return `${this.imageApiUrl}/${imageId}`;
  }

  getImageMetadata(imageId: number): Observable<any> {
    return this.http.get(`${this.imageApiUrl}/${imageId}/metadata`);
  }

  getAllImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.imageApiUrl}/all`);
  }

  deleteImage(imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.imageApiUrl}/${imageId}`);
  }
}
