import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumComment } from '@core/Models/forumComment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // L'URL de base pour les forums
  private apiUrl = 'http://localhost:8080/api/forums';
  private baseUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}
  addComment(forumId: number, comment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${forumId}/comments`, comment);
  }
  deleteComment(commentId: number) {
    return this.http.delete(`${this.baseUrl}/forums/:forumId/${commentId}`);
  }
  updateComment(commentId: number, updatedComment: any) {
    return this.http.put(`${this.baseUrl}/forums/:forumId/${commentId}`, updatedComment);
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
  
  // Update your getByForumId method:
  getByForumId(forumId: number): Observable<ForumComment[]> {
    console.log(`Fetching comments for forum ${forumId}`);
    return this.http.get<ForumComment[]>(`${this.apiUrl}/${forumId}/comments`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error fetching comments for forum ${forumId}:`, error);
        // Return empty array to prevent component errors
        return of([]);
      })
    );
  }
  

  // 🔄 Récupérer tous les commentaires
  getAll(): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${this.apiUrl}/comments`);
  }

  // 🔍 Récupérer un commentaire par son ID
  getById(id: number): Observable<ForumComment> {
    return this.http.get<ForumComment>(`${this.apiUrl}/comments/${id}`);
  }

  // 📝 Créer un nouveau commentaire
  create(comment: ForumComment, forumId: number): Observable<ForumComment> {
    // L'URL est modifiée pour correspondre à l'endpoint /forums/{forumId}/comments
    return this.http.post<ForumComment>(`${this.apiUrl}/${forumId}/comments`, comment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // ❌ Supprimer un commentaire
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${id}`);
  }
  // 🛠 Modifier un commentaire existant
update(id: number, comment: ForumComment): Observable<ForumComment> {
  return this.http.put<ForumComment>(`${this.apiUrl}/comments/${id}`, comment, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  });
}


  // 📝 Ajouter un commentaire à un forum spécifique
  
}
