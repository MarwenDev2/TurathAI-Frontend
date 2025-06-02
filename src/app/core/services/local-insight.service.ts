// local-insight.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalInsight } from '@core/Models/localInsight';
import { User } from '@core/Models/user';

@Injectable({
  providedIn: 'root'
})
export class LocalInsightService {
  [x: string]: any;
  private apiUrl = `${environment.apiUrl}/api/local-insights`;

  constructor(private http: HttpClient) { }

  getAllLocalInsights(): Observable<LocalInsight[]> {
    return this.http.get<LocalInsight[]>(this.apiUrl).pipe(
      tap(data => console.log('Données reçues:', data)),
      catchError(error => {
        console.error('Erreur:', error);
        return throwError(() => new Error('Erreur de chargement'));
      })
    );
  }
 
  getLocalInsightById(id: number): Observable<LocalInsight> {
    return this.http.get<LocalInsight>(`${this.apiUrl}/${id}`);
  }

  getLocalInsightsBySiteId(siteId: number): Observable<LocalInsight[]> {
    return this.http.get<LocalInsight[]>(`${this.apiUrl}/site/${siteId}`).pipe(
      tap(data => console.log('Local insights for site received:', data)),
      catchError(error => {
        console.error('Error loading local insights for site:', error);
        return throwError(() => new Error('Failed to load local insights for this site'));
      })
    );
  }

  createLocalInsight(localInsight: LocalInsight): Observable<LocalInsight> {
    return this.http.post<LocalInsight>(`${this.apiUrl}/creation`, localInsight);
  }
  
  /**
   * Sends an email notification after a local insight has been created
   * @param localInsightId The ID of the created local insight
   * @param userEmail The email of the user who created the local insight
   * @param userName The name of the user who created the local insight
   * @returns Observable with the notification result
   */
  sendLocalInsightNotification(localInsightId: number, userEmail: string, userName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/local-insights/notify`, {
      localInsightId,
      userEmail,
      userName
    });
  }

  deleteLocalInsight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateLocalInsight(localInsight: any) {
    return this.http.put(`${environment.apiUrl}/api/local-insights/edit/${localInsight.id}`, localInsight);
  }
  
  getInsightStats() {
    return this.http.get<{
      total: number;
      byType: Record<string, number>;
      lastMonthCount: number;
    }>(`${this.apiUrl}/stats`);
  }

 // Dans local-insight.service.ts
toggleLike(insightId: number, likeStatus: boolean): Observable<LocalInsight> {
  return this.http.patch<LocalInsight>(`${this.apiUrl}/${insightId}/like`, {
    isLiked: likeStatus
  });
}

likeLocalInsight(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${id}/like`, {}).pipe(
    catchError(error => {
      console.error('Erreur lors du like:', error);
      return throwError(() => new Error('Erreur lors du like'));
    })
  );
}

dislikeLocalInsight(id: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/${id}/dislike`, {}).pipe(
    catchError(error => {
      console.error('Erreur lors du dislike:', error);
      return throwError(() => new Error('Erreur lors du dislike'));
    })
  );
}

removeLike(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}/like`).pipe(
    catchError(error => {
      console.error('Erreur lors de la suppression du like:', error);
      return throwError(() => new Error('Erreur lors de la suppression du like'));
    })
  );
}

removeDislike(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}/dislike`).pipe(
    catchError(error => {
      console.error('Erreur lors de la suppression du dislike:', error);
      return throwError(() => new Error('Erreur lors de la suppression du dislike'));
    })
  );
}

incrementLike(insightId: number): Observable<LocalInsight> {
  return this.http.patch<LocalInsight>(`${this.apiUrl}/${insightId}/like`, {});
}

incrementDislike(insightId: number): Observable<LocalInsight> {
  return this.http.patch<LocalInsight>(`${this.apiUrl}/${insightId}/dislike`, {});
}
}