import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Itinery } from '../Models/itinerary';
import { ItineraryStatistics } from '../Models/itinerary-statistics';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ItenaryService {
  private apiUrl = 'http://localhost:9090/api/itineries'; // Adjust if your backend runs elsewhere

  constructor(private http: HttpClient) {}

  getAll(): Observable<Itinery[]> {
    return this.http.get<Itinery[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Itinery> {
    return this.http.get<Itinery>(`${this.apiUrl}/get/${id}`);
  }

  add(itinery: Itinery): Observable<Itinery> {
    return this.http.post<Itinery>(`${this.apiUrl}/add`, itinery);
  }

  update(itinery: Itinery): Observable<Itinery> {
    return this.http.put<Itinery>(`${this.apiUrl}/update`, itinery);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`);
  }

  getItinerariesBySiteId(siteId: number): Observable<Itinery[]> {
    return this.http.get<Itinery[]>(`${this.apiUrl}/site/${siteId}`);
  }
  
  getQRCode(id: number): string {
    return `http://localhost:9090/api/qrcode/itinery/${id}`;
  }

  exportToPdf(): Observable<Blob> {
    return this.http.get(`http://localhost:9090/api/export/pdf`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      },
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        // Extract the blob from the response
        return new Blob([response.body as BlobPart], {
          type: 'application/pdf'
        });
      })
    );
  }

  exportToExcel(): Observable<Blob> {
    return this.http.get(`http://localhost:9090/api/export/excel`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<Blob>) => {
        // Extract the blob from the response
        return new Blob([response.body as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      })
    );
  }
  
  getStatistics(): Observable<ItineraryStatistics> {
    return this.http.get<ItineraryStatistics>(`${this.apiUrl}/statistics`);
  }
}
