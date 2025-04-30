import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { Router, RouterModule } from '@angular/router';
import { CommentService } from '@core/services/comment.service';
import { FormsModule } from '@angular/forms';
import { ForumComment } from '@core/Models/forumComment';
import { AuthService } from '@core/services/auth.service';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { LocalStorageService } from '@core/services/local-storage.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EmojiPickerComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private forumService = inject(ForumService);
  private commentService = inject(CommentService);
  private localStorageService = inject(LocalStorageService);
  private confirmDialogService = inject(ConfirmDialogService);
  private authService = inject(AuthService);
  private router = inject(Router);

  forums: any[] = [];
  isLoading = true;
  currentUserId: number = 0;
  errorMessage: string = '';
  commentBeingEdited: any = null;
  
  // Liste des mots interdits
  BAD_WORDS = [
    "bonjour", "abus", "violence", "fuck", "fucker", "raciste", "hate", "nazi",
    "bitch", "asshole", "idiot", "stupid", "puta", "mrd", "schwein", "cochon", 
    "putain", "chienne", "douchebag", "bastardo", "cazzo", "mierda", "con", "fils de pute"
  ];
  
  // Pour le sélecteur d'émojis
  showEmojiPicker = false;
  currentForumId: number | null = null; // Pour suivre quel forum a le picker ouvert
  lastCursorPosition = 0;
  
  ngOnInit() {
    // Récupérer l'ID de l'utilisateur actuel
    this.getCurrentUser();
    this.loadForums();
  }
  
  // Méthode pour récupérer l'utilisateur actuel
  getCurrentUser(): void {
    // Essayer d'abord de récupérer l'ID utilisateur depuis localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.currentUserId = +userId;
    }
    
    // Récupérer aussi depuis le service d'authentification
    const user = this.authService.currentUser;
    if (user && user.id) {
      this.currentUserId = user.id;
    }
    
    console.log('Current user ID:', this.currentUserId);
  }
  
  loadForums() {
    this.isLoading = true;
    this.forumService.getAll().subscribe({
      next: (data) => {
        this.forums = data;
        this.isLoading = false;
        
        // Load comments for each forum
        this.forums.forEach(forum => {
          forum.showComments = true;
          forum.comments = [];
          forum.hasErrorWord = false;
          forum.badWordError = '';
          this.loadComments(forum);
        });
      },
      error: (err) => {
        console.error('Error loading forums:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load forums. Please try again later.';
      }
    });
  }

  loadComments(forum: Forum): void {
    // Essayer d'abord de charger les commentaires du localStorage
    const localComments = this.localStorageService.getForumComments(forum.id!);
    if (localComments && localComments.length > 0) {
      forum.comments = localComments;
    }
    
    // Puis charger les commentaires du serveur et mettre à jour
    this.commentService.getByForumId(forum.id!).subscribe({
      next: (comments: ForumComment[]) => {
        // S'assurer que tous les commentaires ont une propriété userId
        const processedComments = comments.map((comment: any) => {
          // Si userId n'existe pas ou est null, attribuer currentUserId
          if (!comment.userId) {
            comment.userId = this.currentUserId;
          }
          return comment;
        });
        
        // Fusionner les commentaires du serveur avec les commentaires locaux
        if (localComments && localComments.length > 0) {
          // Identifier les nouveaux commentaires du serveur
          const serverCommentIds = processedComments.map((c: ForumComment) => c.id);
          const localOnlyComments = localComments.filter((c: any) => !c.id || !serverCommentIds.includes(c.id));
          
          // Combiner tous les commentaires
          forum.comments = [...processedComments, ...localOnlyComments];
        } else {
          forum.comments = processedComments;
        }
        
        // Sauvegarder les commentaires dans le localStorage
        this.localStorageService.saveForumComments(forum.id!, forum.comments);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        // En cas d'erreur, utiliser uniquement les commentaires locaux
        if (!forum.comments || forum.comments.length === 0) {
          forum.comments = localComments;
        }
      }
    });
  }

  getImageUrl(forum: Forum): string {
    if (!forum.image) {
      return 'assets/images/default-avatar.png';
    }
    return `http://localhost:8080/assets/images/users/${forum.image}`;
  }

  navigateToDetails(forum: Forum): void {
    this.router.navigate(['/frontoffice/forums/details', forum.id]);
  }

  createForum(): void {
    this.router.navigate(['/frontoffice/forums/add']);
  }
  
  // Vérifier si l'utilisateur actuel est l'auteur d'un forum
  isForumOwner(forum: any): boolean {
    // Log pour dépannage
    console.log('isForumOwner check:', {
      forumExists: !!forum,
      forumUserId: forum?.userId,
      currentUserId: this.currentUserId,
      isMatch: forum && this.currentUserId === forum.userId
    });
    
    // Permettre à tout utilisateur connecté de modifier/supprimer (pour test)
    return this.currentUserId > 0;
    
    // Logique originale
    // return forum && this.currentUserId === forum.userId;
  }

  // Vérifier si l'utilisateur actuel est l'auteur d'un commentaire
  isCommentOwner(comment: any): boolean {
    // Log pour dépannage
    console.log('isCommentOwner check:', {
      commentExists: !!comment,
      commentUserId: comment?.userId,
      currentUserId: this.currentUserId,
      isMatch: comment && this.currentUserId === comment.userId
    });
    
    // Permettre à tout utilisateur connecté de modifier/supprimer (pour test)
    return this.currentUserId > 0;
    
    // Logique originale
    // return comment && this.currentUserId === comment.userId;
  }
  
  editComment(comment: any, forum: any): void {
    if (this.isCommentOwner(comment)) {
      this.commentBeingEdited = comment;
      forum.newComment = comment.content;
      // Réinitialiser les erreurs lors de l'édition
      forum.hasErrorWord = false;
      forum.badWordError = '';
    }
  }
  
  cancelEditingComment(): void {
    this.commentBeingEdited = null;
    this.forums.forEach(forum => {
      forum.newComment = '';
      forum.hasErrorWord = false;
      forum.badWordError = '';
    });
  }
  
  deleteComment(comment: any, forum: any): void {
    if (this.isCommentOwner(comment)) {
      this.confirmDialogService.confirm({
        title: 'Supprimer le commentaire',
        message: 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }).then(confirmed => {
        if (confirmed) {
          // D'abord mettre à jour le localStorage
          this.localStorageService.deleteComment(forum.id, comment.id);
          
          // Puis envoyer la requête au serveur
          this.commentService.deleteComment(comment.id).subscribe({
            next: () => {
              forum.comments = forum.comments.filter((c: any) => c.id !== comment.id);
            },
            error: (err) => {
              console.error('Error deleting comment:', err);
              this.errorMessage = 'Failed to delete comment. Please try again.';
              // Même en cas d'erreur, on garde la suppression locale
              forum.comments = forum.comments.filter((c: any) => c.id !== comment.id);
            }
          });
        }
      });
    }
  }
  
  // Fonction pour vérifier les mots interdits pendant la saisie
  checkForBadWords(forum: any): void {
    if (!forum.newComment) {
      forum.hasErrorWord = false;
      forum.badWordError = '';
      return;
    }
    
    const foundBadWord = this.BAD_WORDS.find(word => 
      forum.newComment.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundBadWord) {
      forum.hasErrorWord = true;
      forum.badWordError = `Ce mot est interdit : "${foundBadWord}"`;
    } else {
      forum.hasErrorWord = false;
      forum.badWordError = '';
    }
  }
  
  addComment(forum: any): void {
    if (forum.newComment && forum.newComment.trim()) {
      // Check for forbidden words
      const containsBadWord = this.BAD_WORDS.some(word => 
        forum.newComment.toLowerCase().includes(word));

      if (containsBadWord) {
        this.errorMessage = 'Comment contains forbidden words.';
        // Ne pas vider le commentaire pour permettre à l'utilisateur de le corriger
        return;
      }
      
      this.errorMessage = '';
      
      if (this.commentBeingEdited) {
        // Updating existing comment
        const updatedComment = {
          ...this.commentBeingEdited,
          content: forum.newComment
        };
        
        // Mettre à jour dans le localStorage
        this.localStorageService.updateComment(forum.id, this.commentBeingEdited.id, updatedComment);
        
        // Puis envoyer la requête au serveur
        this.commentService.updateComment(this.commentBeingEdited.id, updatedComment).subscribe({
          next: (res: any) => {
            const index = forum.comments.findIndex((c: any) => c.id === this.commentBeingEdited.id);
            if (index !== -1) {
              forum.comments[index] = res;
              // Mettre à jour à nouveau avec la réponse du serveur
              this.localStorageService.updateComment(forum.id, res.id, res);
            }
            this.commentBeingEdited = null;
            forum.newComment = '';
            forum.hasErrorWord = false;
            forum.badWordError = '';
          },
          error: (err) => {
            console.error('Error updating comment:', err);
            this.errorMessage = 'Failed to update comment. Please try again.';
            // Même en cas d'erreur, garder la mise à jour locale
            const index = forum.comments.findIndex((c: any) => c.id === this.commentBeingEdited.id);
            if (index !== -1) {
              forum.comments[index] = updatedComment;
            }
            this.commentBeingEdited = null;
            forum.newComment = '';
          }
        });
      } else {
        // Adding new comment - generate a temporary local ID
        const tempId = 'local_' + Date.now();
        const comment = {
          id: tempId,
          content: forum.newComment,
          image: '',
          userId: this.currentUserId,
          forumId: forum.id,
          createdAt: new Date().toISOString(),
          liked: 0,
          disliked: 0,
          username: 'You' // Nom temporaire pour l'affichage local
        };
        
        // Ajouter immédiatement au localStorage et à l'affichage
        forum.comments.push(comment);
        this.localStorageService.addComment(forum.id, comment);
        forum.newComment = '';
        forum.hasErrorWord = false;
        forum.badWordError = '';
      
        // Puis envoyer au serveur
        this.commentService.addComment(forum.id, comment).subscribe({
          next: (res: any) => {
            // Remplacer le commentaire temporaire par celui du serveur
            const index = forum.comments.findIndex((c: any) => c.id === tempId);
            if (index !== -1) {
              forum.comments[index] = res;
              
              // Mettre à jour le localStorage avec l'ID du serveur
              this.localStorageService.deleteComment(forum.id, tempId);
              this.localStorageService.addComment(forum.id, res);
            }
          },
          error: (err) => {
            console.error('Error adding comment:', err);
            this.errorMessage = 'Failed to sync comment with server, but it is saved locally.';
            // Le commentaire reste affiché localement même en cas d'erreur
          }
        });
      }
    }
  }
  
  // Logique pour les émojis  
  toggleEmojiPicker(event: Event, forumId: number): void {
    // Arrêter complètement la propagation et le comportement par défaut
    event.stopPropagation();
    event.preventDefault();
    
    if (this.currentForumId === forumId && this.showEmojiPicker) {
      // Si le même forum, fermer
      this.showEmojiPicker = false;
      this.currentForumId = null;
    } else {
      // Si nouveau forum ou fermé, ouvrir
      this.showEmojiPicker = true;
      this.currentForumId = forumId;
      this.saveTextAreaPosition(forumId);
    }
  }
  
  closeEmojiPicker(): void {
    this.showEmojiPicker = false;
    this.currentForumId = null;
  }
  
  saveTextAreaPosition(forumId: number): void {
    // Trouver le textarea du forum actuel
    const forumCard = document.querySelector(`[data-forum-id="${forumId}"]`);
    if (forumCard) {
      const textarea = forumCard.querySelector('textarea');
      if (textarea) {
        this.lastCursorPosition = (textarea as HTMLTextAreaElement).selectionStart;
      }
    }
  }
  
  addEmoji(emoji: string): void {
    if (!this.currentForumId) return;
    
    const forum = this.forums.find(f => f.id === this.currentForumId);
    if (!forum) return;
    
    if (!forum.newComment) {
      forum.newComment = '';
    }
    
    // Trouver le textarea du forum actuel
    const forumCard = document.querySelector(`[data-forum-id="${this.currentForumId}"]`);
    if (forumCard) {
      const textarea = forumCard.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = this.lastCursorPosition;
        const end = this.lastCursorPosition;
        const text = textarea.value;
        
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        
        forum.newComment = before + emoji + after;
        
        // Mettre à jour la position du curseur
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = start + emoji.length;
          textarea.selectionEnd = start + emoji.length;
          this.lastCursorPosition = start + emoji.length;
        }, 10);
      } else {
        forum.newComment += emoji;
      }
    } else {
      forum.newComment += emoji;
    }
    
    this.closeEmojiPicker();
  }
}
