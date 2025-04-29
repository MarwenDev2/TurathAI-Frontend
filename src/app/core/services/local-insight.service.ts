// local-insight.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LocalInsight } from '@core/Models/localInsight';

@Injectable({
  providedIn: 'root'
})
export class LocalInsightService {
  [x: string]: any;
  private apiUrl = `http://localhost:9090/api/local-insights`;

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

  createLocalInsight(localInsight: LocalInsight): Observable<LocalInsight> {
    return this.http.post<LocalInsight>(`${this.apiUrl}/creation`, localInsight);
  }

  

  deleteLocalInsight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateLocalInsight(localInsight: any) {
    return this.http.put(`http://localhost:9090/api/local-insights/edit/${localInsight.id}`, localInsight);
  }
  
  getInsightStats() {
    return this.http.get<{
      total: number;
      byType: Record<string, number>;
      lastMonthCount: number;
    }>(`${this.apiUrl}/stats`);
  }

  getLocalInsightsBySiteId(siteId: number): Observable<LocalInsight[]> {
    return this.http.get<LocalInsight[]>(`${this.apiUrl}/site/${siteId}`).pipe(
      tap(data => console.log('Local insights for site:', data)),
      catchError(error => {
        console.error('Error loading local insights:', error);
        return throwError(() => new Error('Failed to load local insights'));
      })
    );
  }

  likeInsight(insightId: number): Observable<LocalInsight> {
    return this.http.post<LocalInsight>(`${this.apiUrl}/${insightId}/like`, {}).pipe(
      tap(data => console.log('Liked insight:', data)),
      catchError(error => {
        console.error('Error liking insight:', error);
        return throwError(() => new Error('Failed to like insight'));
      })
    );
  }

  dislikeInsight(insightId: number): Observable<LocalInsight> {
    return this.http.post<LocalInsight>(`${this.apiUrl}/${insightId}/dislike`, {}).pipe(
      tap(data => console.log('Disliked insight:', data)),
      catchError(error => {
        console.error('Error disliking insight:', error);
        return throwError(() => new Error('Failed to dislike insight'));
      })
    );
  }
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