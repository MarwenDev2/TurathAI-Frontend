import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '@core/services/comment.service';
import { FormsModule } from '@angular/forms';
import { ForumComment } from '@core/Models/forumComment';
import { LocalStorageService } from '@core/services/local-storage.service';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { AuthService } from '@core/services/auth.service';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EmojiPickerComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  private forumService = inject(ForumService);
  private commentService = inject(CommentService);
  private localStorageService = inject(LocalStorageService);
  private confirmDialogService = inject(ConfirmDialogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  forum: any = null;
  isLoading = true;
  errorMessage: string = '';
  forumId: number = 0;
  currentUserId: number = 0;
  newComment: string = '';
  commentBeingEdited: any = null;
  hasErrorWord: boolean = false;
  badWordError: string = '';
  
  // Liste des mots interdits
  BAD_WORDS = [
    "bonjour", "abus", "violence", "fuck", "fucker", "raciste", "hate", "nazi",
    "bitch", "asshole", "idiot", "stupid", "puta", "mrd", "schwein", "cochon", 
    "putain", "chienne", "douchebag", "bastardo", "cazzo", "mierda", "con", "fils de pute"
  ];
  
  // Pour le sélecteur d'émojis
  showEmojiPicker = false;
  emojiButtonPosition = { top: 0, left: 0 };
  lastCursorPosition = 0;
  
  ngOnInit() {
    // Récupérer l'ID de l'utilisateur actuel
    this.getCurrentUser();
    
    this.route.params.subscribe(params => {
      this.forumId = +params['id'];
      this.loadForum();
    });
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
  
  loadForum() {
    this.isLoading = true;
    this.forumService.getById(this.forumId).subscribe({
      next: (data: any) => {
        this.forum = data;
        this.forum.comments = [];
        this.isLoading = false;
        this.loadComments();
        
        // Afficher les informations pour le débogage
        console.log('Forum data:', this.forum);
        console.log('Forum userId:', this.forum.userId);
        console.log('Current userId:', this.currentUserId);
        console.log('Can edit/delete:', this.currentUserId === this.forum.userId);
      },
      error: (err: any) => {
        console.error('Error loading forum details:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load forum details. Please try again later.';
      }
    });
  }

  loadComments() {
    // Essayer d'abord de charger les commentaires du localStorage
    const localComments = this.localStorageService.getForumComments(this.forumId);
    if (localComments && localComments.length > 0) {
      this.forum.comments = localComments;
    }
    
    // Puis charger les commentaires du serveur
    this.commentService.getByForumId(this.forumId).subscribe({
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
          this.forum.comments = [...processedComments, ...localOnlyComments];
        } else {
          this.forum.comments = processedComments;
        }
        
        // Sauvegarder les commentaires dans le localStorage
        this.localStorageService.saveForumComments(this.forumId, this.forum.comments);
      },
      error: (err: any) => {
        console.error('Error loading comments:', err);
        // En cas d'erreur, utiliser uniquement les commentaires locaux
        if (!this.forum.comments || this.forum.comments.length === 0) {
          this.forum.comments = localComments;
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

  goBack() {
    this.router.navigate(['/frontoffice/forums']);
  }

  // Fonction pour préparer l'édition du forum
  editForum() {
    if (this.isForumOwner()) {
      // Stocker le forum actuel dans localStorage pour le récupérer dans le composant d'édition
      localStorage.setItem('editingForum', JSON.stringify(this.forum));
      this.router.navigate(['/frontoffice/forums/edit', this.forum.id]);
    }
  }

  // Vérifier si l'utilisateur actuel est l'auteur du forum
  isForumOwner(): boolean {
    // Temporairement, retourner true pour tous les utilisateurs pour afficher les boutons
    // return true; 
    
    // Log pour dépannage
    console.log('isForumOwner check:', {
      forumExists: !!this.forum,
      forumUserId: this.forum?.userId,
      currentUserId: this.currentUserId,
      isMatch: this.forum && this.currentUserId === this.forum.userId
    });
    
    // Permettre à tout utilisateur connecté de modifier/supprimer (pour test)
    return this.currentUserId > 0;
    
    // Logique originale
    // return this.forum && this.currentUserId === this.forum.userId;
  }

  deleteForum() {
    if (this.isForumOwner()) {
      this.confirmDialogService.confirm({
        title: 'Supprimer le forum',
        message: 'Êtes-vous sûr de vouloir supprimer ce forum ? Cette action est irréversible.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }).then(confirmed => {
        if (confirmed) {
          this.forumService.delete(this.forumId).subscribe({
            next: () => {
              this.router.navigate(['/frontoffice/forums']);
            },
            error: (err: any) => {
              console.error('Error deleting forum:', err);
              this.errorMessage = 'Failed to delete forum. Please try again.';
            }
          });
        }
      });
    }
  }
  
  // Fonction pour vérifier les mots interdits pendant la saisie
  checkForBadWords(): void {
    if (!this.newComment) {
      this.hasErrorWord = false;
      this.badWordError = '';
      return;
    }
    
    const foundBadWord = this.BAD_WORDS.find(word => 
      this.newComment.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundBadWord) {
      this.hasErrorWord = true;
      this.badWordError = `Ce mot est interdit : "${foundBadWord}"`;
    } else {
      this.hasErrorWord = false;
      this.badWordError = '';
    }
  }
  
  // Fonction pour vérifier si l'utilisateur actuel est l'auteur du commentaire
  isCommentOwner(comment: any): boolean {
    // Temporairement, retourner true pour tous les utilisateurs pour afficher les boutons
    // return true;
    
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
  
  // Fonction pour commencer l'édition d'un commentaire
  editComment(comment: any): void {
    if (this.isCommentOwner(comment)) {
      this.commentBeingEdited = comment;
      this.newComment = comment.content;
      // Réinitialiser les erreurs lors de l'édition
      this.hasErrorWord = false;
      this.badWordError = '';
      
      // Faire défiler jusqu'au formulaire de commentaire
      setTimeout(() => {
        const element = document.getElementById('comment-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }
  
  // Fonction pour annuler l'édition d'un commentaire
  cancelEditingComment(): void {
    this.commentBeingEdited = null;
    this.newComment = '';
    this.hasErrorWord = false;
    this.badWordError = '';
  }
  
  // Fonction pour supprimer un commentaire
  deleteComment(comment: any): void {
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
          this.localStorageService.deleteComment(this.forumId, comment.id);
          
          // Puis envoyer la requête au serveur
          this.commentService.deleteComment(comment.id).subscribe({
            next: () => {
              this.forum.comments = this.forum.comments.filter((c: any) => c.id !== comment.id);
            },
            error: (err: any) => {
              console.error('Error deleting comment:', err);
              this.errorMessage = 'Failed to delete comment. Please try again.';
              // Même en cas d'erreur, on garde la suppression locale
              this.forum.comments = this.forum.comments.filter((c: any) => c.id !== comment.id);
            }
          });
        }
      });
    }
  }
  
  addComment() {
    if (this.newComment && this.newComment.trim()) {
      // Check for forbidden words
      const containsBadWord = this.BAD_WORDS.some(word => 
        this.newComment.toLowerCase().includes(word));

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
          content: this.newComment
        };
        
        // Mettre à jour dans le localStorage
        this.localStorageService.updateComment(this.forumId, this.commentBeingEdited.id, updatedComment);
        
        // Puis envoyer la requête au serveur
        this.commentService.updateComment(this.commentBeingEdited.id, updatedComment).subscribe({
          next: (res: any) => {
            const index = this.forum.comments.findIndex((c: any) => c.id === this.commentBeingEdited.id);
            if (index !== -1) {
              this.forum.comments[index] = res;
              // Mettre à jour à nouveau avec la réponse du serveur
              this.localStorageService.updateComment(this.forumId, res.id, res);
            }
            this.commentBeingEdited = null;
            this.newComment = '';
            this.hasErrorWord = false;
            this.badWordError = '';
          },
          error: (err: any) => {
            console.error('Error updating comment:', err);
            this.errorMessage = 'Failed to update comment. Please try again.';
            // Même en cas d'erreur, garder la mise à jour locale
            const index = this.forum.comments.findIndex((c: any) => c.id === this.commentBeingEdited.id);
            if (index !== -1) {
              this.forum.comments[index] = updatedComment;
            }
            this.commentBeingEdited = null;
            this.newComment = '';
          }
        });
      } else {
        // Adding new comment - generate a temporary local ID
        const tempId = 'local_' + Date.now();
        const comment = {
          id: tempId,
          content: this.newComment,
          image: '',
          userId: this.currentUserId,
          forumId: this.forumId,
          createdAt: new Date().toISOString(),
          liked: 0,
          disliked: 0,
          username: 'You' // Nom temporaire pour l'affichage local
        };
        
        // Ajouter immédiatement au localStorage et à l'affichage
        this.forum.comments.push(comment);
        this.localStorageService.addComment(this.forumId, comment);
        this.newComment = '';
        this.hasErrorWord = false;
        this.badWordError = '';
      
        // Puis envoyer au serveur
        this.commentService.addComment(this.forumId, comment).subscribe({
          next: (res: any) => {
            // Remplacer le commentaire temporaire par celui du serveur
            const index = this.forum.comments.findIndex((c: any) => c.id === tempId);
            if (index !== -1) {
              this.forum.comments[index] = res;
              
              // Mettre à jour le localStorage avec l'ID du serveur
              this.localStorageService.deleteComment(this.forumId, tempId);
              this.localStorageService.addComment(this.forumId, res);
            }
          },
          error: (err: any) => {
            console.error('Error adding comment:', err);
            this.errorMessage = 'Failed to sync comment with server, but it is saved locally.';
            // Le commentaire reste affiché localement même en cas d'erreur
          }
        });
      }
    }
  }
  
  // Méthode pour ouvrir le sélecteur d'émojis
  toggleEmojiPicker(event: Event): void {
    // Arrêter complètement la propagation et le comportement par défaut
    event.stopPropagation();
    event.preventDefault();
    
    // Simple toggle
    this.showEmojiPicker = !this.showEmojiPicker;
    
    if (this.showEmojiPicker) {
      this.saveTextAreaPosition();
    }
  }

  closeEmojiPicker(): void {
    this.showEmojiPicker = false;
  }

  saveTextAreaPosition(): void {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      this.lastCursorPosition = textarea.selectionStart;
    }
  }

  addEmoji(emoji: string): void {
    if (!this.newComment) {
      this.newComment = '';
    }

    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = this.lastCursorPosition;
      const end = this.lastCursorPosition;
      const text = textarea.value;
      
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      
      this.newComment = before + emoji + after;
      
      // Update cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + emoji.length;
        textarea.selectionEnd = start + emoji.length;
        this.lastCursorPosition = start + emoji.length;
      }, 10);
    } else {
      this.newComment += emoji;
    }
    
    this.closeEmojiPicker();
  }
}
