import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {

    private apiUrl = 'http://localhost:8080/images';

  constructor(private http: HttpClient) {}

  uploadVideo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/video-upload`, formData);
  }
}
