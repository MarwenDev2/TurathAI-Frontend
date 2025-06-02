import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ForumComment } from '@core/Models/forumComment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

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

  createComment(forumId: number, comment: ForumComment): Observable<ForumComment> {
    return this.http.post<ForumComment>(
      `${this.baseUrl}/forums/${forumId}`, 
      comment, 
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error creating comment:', error);
        // Return an empty/default ForumComment object
        return of({
          id: 0,
          content: '',
          userId: 0,
          forumId: forumId,
          createdAt: new Date(),
          liked: 0,
          disliked: 0
        });
      })
    );
  }

  getCommentsByForum(forumId: number): Observable<ForumComment[]> {
    return this.http.get<ForumComment[]>(
      `${this.baseUrl}/forum/${forumId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error(`Error fetching comments for forum ${forumId}:`, error);
        return of([]);
      })
    );
  }

  // Get a single comment by ID
  getCommentById(id: number): Observable<ForumComment> {
    return this.http.get<ForumComment>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }

  // Update a comment
  updateComment(id: number, updatedComment: ForumComment): Observable<ForumComment> {
    return this.http.put<ForumComment>(
      `${this.baseUrl}/${id}`,
      updatedComment,
      { headers: this.getHeaders() }
    );
  }

  // Delete a comment
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}