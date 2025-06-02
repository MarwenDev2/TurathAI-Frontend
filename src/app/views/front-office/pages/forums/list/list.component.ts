import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
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
import { User } from '@core/Models/user';

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
  private confirmDialogService = inject(ConfirmDialogService);
  private authService = inject(AuthService);
  private router = inject(Router);

  forums: Forum[] = [];
  isLoading = true;
  currentUserId: number = 0;
  errorMessage: string = '';
  commentBeingEdited: ForumComment | null = null;
  
  // Liste des mots interdits
  BAD_WORDS = [
    "bonjour", "abus", "violence", "fuck", "fucker", "raciste", "hate", "nazi",
    "bitch", "asshole", "idiot", "stupid", "puta", "mrd", "schwein", "cochon", 
    "putain", "chienne", "douchebag", "bastardo", "cazzo", "mierda", "con", "fils de pute"
  ];
  
  // Pour le sélecteur d'émojis
  showEmojiPicker = false;
  currentForumId: number | null = null;
  lastCursorPosition = 0;
  
  ngOnInit() {
    this.getCurrentUser();
    this.loadForums();
  }
  
  getCurrentUser(): void {
    const user = this.authService.currentUser;
    if (user && user.id) {
      this.currentUserId = user.id;
    }
  }
  
  loadForums() {
    this.isLoading = true;
    this.forumService.getAll().subscribe({
      next: (forums) => {
        this.forums = forums.map(forum => ({
          ...forum,
          showComments: true,
          comments: [],
          hasErrorWord: false,
          badWordError: '',
          newComment: ''
        }));
        this.isLoading = false;
        
        // Load comments for each forum
        this.forums.forEach(forum => {
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
    this.commentService.getCommentsByForum(forum.id!).subscribe({
      next: (comments) => {
        forum.comments = comments;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        forum.comments = [];
      }
    });
  }

  getImageUrl(forum: Forum): string {
    if (!forum.image) {
      return 'assets/images/default-avatar.png';
    }
    return `${environment.apiUrl}/assets/images/users/${forum.image}`;
  }

  navigateToDetails(forum: Forum): void {
    this.router.navigate(['/frontoffice/forums/details', forum.id]);
  }

  createForum(): void {
    this.router.navigate(['/frontoffice/forums/add']);
  }
  
  isForumOwner(forum: Forum): boolean {
    return forum.user?.id === this.currentUserId;
  }

  isCommentOwner(comment: ForumComment): boolean {
    return comment.user?.id === this.currentUserId;
  }
  
  editComment(comment: ForumComment, forum: Forum): void {
    if (this.isCommentOwner(comment)) {
      this.commentBeingEdited = comment;
      forum.newComment = comment.content;
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
  
  deleteComment(comment: ForumComment, forum: Forum): void {
    if (this.isCommentOwner(comment)) {
      this.confirmDialogService.confirm({
        title: 'Supprimer le commentaire',
        message: 'Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        type: 'danger'
      }).then(confirmed => {
        if (confirmed) {
          this.commentService.deleteComment(comment.id!).subscribe({
            next: () => {
              forum.comments = forum.comments?.filter(c => c.id !== comment.id);
            },
            error: (err) => {
              console.error('Error deleting comment:', err);
              this.errorMessage = 'Failed to delete comment. Please try again.';
            }
          });
        }
      });
    }
  }
  
  checkForBadWords(forum: Forum): void {
    if (!forum.newComment) {
      forum.hasErrorWord = false;
      forum.badWordError = '';
      return;
    }
    
    const foundBadWord = this.BAD_WORDS.find(word => 
      forum.newComment!.toLowerCase().includes(word.toLowerCase())
    );
    
    if (foundBadWord) {
      forum.hasErrorWord = true;
      forum.badWordError = `Ce mot est interdit : "${foundBadWord}"`;
    } else {
      forum.hasErrorWord = false;
      forum.badWordError = '';
    }
  }
  
  addComment(forum: Forum): void {
    if (!forum.newComment?.trim()) return;
    
    if (this.commentBeingEdited) {
      this.updateExistingComment(forum);
    } else {
      this.addNewComment(forum);
    }
  }

  private updateExistingComment(forum: Forum): void {
    if (!this.commentBeingEdited || !forum.newComment) {
        return;
    }

    const updatedComment: ForumComment = {
        ...this.commentBeingEdited,
        content: forum.newComment,
        updatedAt: new Date().toISOString(),
        isEdited: true
    };
    
    this.commentService.updateComment(this.commentBeingEdited.id!, updatedComment).subscribe({
        next: (res) => {
            if (!forum.comments) {
                forum.comments = [];
            }
            const index = forum.comments.findIndex(c => c.id === this.commentBeingEdited?.id);
            if (index !== -1) {
                forum.comments[index] = res;
            }
            this.resetCommentForm(forum);
        },
        error: (err) => {
            console.error('Error updating comment:', err);
            this.errorMessage = 'Failed to update comment. Please try again.';
        }
    });
}

// Add this new method for user images
getUserImageUrl(user: User | undefined): string {
  if (!user?.image) {
    return 'assets/images/default-avatar.png';
  }
  return `${environment.apiUrl}/assets/images/users/${user.image}`;
}

// Keep the existing one for forum images
getForumImageUrl(forum: Forum): string {
  if (!forum.image) {
    return 'assets/images/default-forum.jpg';
  }
  return `${environment.apiUrl}/assets/images/users/${forum.image}`;
}

private addNewComment(forum: Forum): void {
  if (!forum.newComment || !forum.newComment.trim()) {
      return;
  }

  const comment: ForumComment = {
      content: forum.newComment, // Now we're sure it's not undefined
      userId: this.currentUserId,
      forumId: forum.id!,
      createdAt: new Date().toISOString(),
      liked: 0,
      disliked: 0,
      user: this.authService.currentUser!,
  };

  this.commentService.createComment(forum.id!, comment).subscribe({
      next: (newComment) => {
          if (!forum.comments) {
              forum.comments = [];
          }
          forum.comments.push(newComment);
          this.resetCommentForm(forum);
      },
      error: (err) => {
          console.error('Error adding comment:', err);
          this.errorMessage = 'Failed to add comment. Please try again.';
      }
  });
}

  private resetCommentForm(forum: Forum): void {
    this.commentBeingEdited = null;
    forum.newComment = '';
    forum.hasErrorWord = false;
    forum.badWordError = '';
  }
  
  // Emoji picker functions remain the same
  toggleEmojiPicker(event: Event, forumId: number): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.currentForumId === forumId && this.showEmojiPicker) {
      this.showEmojiPicker = false;
      this.currentForumId = null;
    } else {
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
    
    const forumCard = document.querySelector(`[data-forum-id="${this.currentForumId}"]`);
    if (forumCard) {
      const textarea = forumCard.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        const start = this.lastCursorPosition;
        const text = textarea.value;
        forum.newComment = text.substring(0, start) + emoji + text.substring(start);
        
        setTimeout(() => {
          textarea.focus();
          const newPos = start + emoji.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
          this.lastCursorPosition = newPos;
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