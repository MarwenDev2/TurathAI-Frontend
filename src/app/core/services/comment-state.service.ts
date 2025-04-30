import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError } from 'rxjs';
import { ForumComment } from '@core/Models/forumComment';
import { CommentService } from './comment.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommentStateService {
  // Cache des commentaires par ID de forum
  private commentsCache: { [forumId: number]: ForumComment[] } = {};
  
  // Subject pour notifier les composants des changements de commentaires
  private commentsChangedSubject = new BehaviorSubject<boolean>(false);
  public commentsChanged$ = this.commentsChangedSubject.asObservable();

  constructor(private commentService: CommentService) {}

  /**
   * Charge les commentaires pour un forum spécifique
   */
  loadCommentsByForumId(forumId: number): Observable<ForumComment[]> {
    console.log(`CommentStateService: Loading comments for forum ${forumId}`);
    return this.commentService.getByForumId(forumId).pipe(
      map((comments: ForumComment[]) => {
        console.log(`CommentStateService: Received ${comments.length} comments for forum ${forumId}`);
        // Mettre à jour le cache
        this.commentsCache[forumId] = comments;
        // Notifier les autres composants
        this.commentsChangedSubject.next(true);
        return comments;
      }),
      catchError(error => {
        console.error(`CommentStateService: Error loading comments for forum ${forumId}:`, error);
        // En cas d'erreur, retourner un tableau vide pour éviter de casser l'UI
        return of([]);
      })
    );
  }

  /**
   * Récupère les commentaires depuis le cache ou charge depuis le serveur si non disponible
   */
  getCommentsByForumId(forumId: number): Observable<ForumComment[]> {
    if (this.commentsCache[forumId]) {
      return of(this.commentsCache[forumId]);
    } else {
      return this.loadCommentsByForumId(forumId);
    }
  }

  /**
   * Ajoute un commentaire
   */
  addComment(forumId: number, comment: any): Observable<ForumComment> {
    return this.commentService.addComment(forumId, comment).pipe(
      map((newComment: ForumComment) => {
        // Mettre à jour le cache
        if (!this.commentsCache[forumId]) {
          this.commentsCache[forumId] = [];
        }
        this.commentsCache[forumId].push(newComment);
        // Notifier les autres composants
        this.commentsChangedSubject.next(true);
        return newComment;
      })
    );
  }

  /**
   * Supprime un commentaire
   */
  deleteComment(commentId: number, forumId: number): Observable<boolean> {
    return this.commentService.deleteComment(commentId).pipe(
      map(() => {
        // Mettre à jour le cache
        if (this.commentsCache[forumId]) {
          this.commentsCache[forumId] = this.commentsCache[forumId].filter(
            (comment) => comment.id !== commentId
          );
        }
        // Notifier les autres composants
        this.commentsChangedSubject.next(true);
        return true;
      })
    );
  }

  /**
   * Met à jour un commentaire
   */
  updateComment(commentId: number, updatedComment: any, forumId: number): Observable<any> {
    return this.commentService.updateComment(commentId, updatedComment).pipe(
      map((updated: any) => {
        // Mettre à jour le cache
        if (this.commentsCache[forumId]) {
          const index = this.commentsCache[forumId].findIndex(c => c.id === commentId);
          if (index !== -1) {
            this.commentsCache[forumId][index] = updated;
          }
        }
        // Notifier les autres composants
        this.commentsChangedSubject.next(true);
        return updated;
      })
    );
  }

  /**
   * Rafraîchit tous les caches de commentaires
   */
  refreshAllComments(): void {
    // Récupérer tous les IDs de forum dans le cache
    const forumIds = Object.keys(this.commentsCache).map(id => parseInt(id));
    
    // Recharger les commentaires pour chaque forum
    forumIds.forEach(forumId => {
      this.loadCommentsByForumId(forumId).subscribe();
    });
  }

  /**
   * Vider le cache
   */
  clearCache(): void {
    this.commentsCache = {};
    this.commentsChangedSubject.next(true);
  }
}