import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly COMMENTS_KEY = 'forum_comments';
  
  constructor() { }

  /**
   * Sauvegarde les commentaires d'un forum spécifique
   */
  saveForumComments(forumId: number, comments: any[]): void {
    // Récupérer tous les commentaires existants
    const allComments = this.getAllComments();
    
    // Mettre à jour les commentaires pour ce forum
    allComments[forumId] = comments;
    
    // Sauvegarder dans localStorage
    localStorage.setItem(this.COMMENTS_KEY, JSON.stringify(allComments));
  }

  /**
   * Récupère les commentaires d'un forum spécifique
   */
  getForumComments(forumId: number): any[] {
    const allComments = this.getAllComments();
    return allComments[forumId] || [];
  }

  /**
   * Récupère tous les commentaires de tous les forums
   */
  getAllComments(): {[forumId: number]: any[]} {
    const commentsStr = localStorage.getItem(this.COMMENTS_KEY);
    return commentsStr ? JSON.parse(commentsStr) : {};
  }

  /**
   * Ajoute un commentaire à un forum spécifique
   */
  addComment(forumId: number, comment: any): void {
    const comments = this.getForumComments(forumId);
    comments.push(comment);
    this.saveForumComments(forumId, comments);
  }

  /**
   * Met à jour un commentaire existant
   */
  updateComment(forumId: number, commentId: number | string, updatedComment: any): void {
    const comments = this.getForumComments(forumId);
    const index = comments.findIndex((c: any) => c.id === commentId);
    
    if (index !== -1) {
      comments[index] = updatedComment;
      this.saveForumComments(forumId, comments);
    }
  }

  /**
   * Supprime un commentaire d'un forum
   */
  deleteComment(forumId: number, commentId: number | string): void {
    const comments = this.getForumComments(forumId);
    const updatedComments = comments.filter((c: any) => c.id !== commentId);
    this.saveForumComments(forumId, updatedComments);
  }

  /**
   * Efface tous les commentaires stockés
   */
  clearAllComments(): void {
    localStorage.removeItem(this.COMMENTS_KEY);
  }
}
