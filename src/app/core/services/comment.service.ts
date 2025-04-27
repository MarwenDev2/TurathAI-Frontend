import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ForumComment } from '@core/Models/forumComment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // L'URL de base pour les forums
  private apiUrl = 'http://localhost:8081/api/forums';
  private baseUrl = 'http://localhost:8081/api/comments';

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

  // 🔍 Récupérer les commentaires par forumId
  getByForumId(forumId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(`${this.apiUrl}/${forumId}/comments`);
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
