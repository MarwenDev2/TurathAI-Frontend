import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Image } from '../Models/image';

@Injectable({
  providedIn: 'root'
})
export class ImageSService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Image>(`${this.apiUrl}/upload`, formData);
  }

  getImageUrl(id: number): string {
    return `${this.apiUrl}/${id}`;
  }
}