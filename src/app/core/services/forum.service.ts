import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError } from 'rxjs';
import { Forum } from '@core/Models/forum';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private apiUrl = 'http://localhost:9090/api/forums';

  // 🔁 Sujet pour notifier les composants abonnés
  private forumsChanged = new BehaviorSubject<boolean>(false);
  forumsChanged$ = this.forumsChanged.asObservable();

  constructor(private http: HttpClient) {}

  // 🔄 GET all forums
  getAll(): Observable<Forum[]> {
    return this.http.get<Forum[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching forums:', error);
        throw error;
      })
    );
  }

  // 🔍 GET forum by ID
  getById(id: number): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching forum with id ${id}:`, error);
        throw error;
      })
    );
  }

  // ➕ POST new forum
  create(forum: Forum): Observable<Forum> {
    return this.http.post<Forum>(this.apiUrl, forum).pipe(
      catchError(error => {
        console.error('Error creating forum:', error);
        throw error;
      })
    );
  }

  // 📝 PUT update forum
  update(id: number, forum: Forum): Observable<Forum> {
    return this.http.put<Forum>(`${this.apiUrl}/${id}`, forum).pipe(
      catchError(error => {
        console.error(`Error updating forum with id ${id}:`, error);
        throw error;
      })
    );
  }

  // ❌ DELETE forum
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting forum with id ${id}:`, error);
        throw error;
      })
    );
  }

  // 💬 Ajouter un commentaire à un forum
  addComment(forumId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/${forumId}/comments`, comment);
  }
  
  getComments(forumId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${forumId}/comments`);
  }
  

  // 🔔 Notifier les abonnés que la liste des forums a changé
  notifyForumAdded(): void {
    this.forumsChanged.next(true);
  }
}
