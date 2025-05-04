import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '@core/services/comment.service';
import { FormsModule } from '@angular/forms';
import { ForumComment } from '@core/Models/forumComment';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { AuthService } from '@core/services/auth.service';
import { EmojiPickerComponent } from '../../../../../shared/components/emoji-picker/emoji-picker.component';
import { User } from '@core/Models/user';

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
  private confirmDialogService = inject(ConfirmDialogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  forum: Forum | null = null;
  isLoading = true;
  errorMessage: string = '';
  forumId: number = 0;
  currentUserId: number = 0;
  newComment: string = '';
  commentBeingEdited: ForumComment | null = null;
  hasErrorWord: boolean = false;
  badWordError: string = '';
  
  // Forbidden words list
  BAD_WORDS = [
    "bonjour", "abus", "violence", "fuck", "fucker", "raciste", "hate", "nazi",
    "bitch", "asshole", "idiot", "stupid", "puta", "mrd", "schwein", "cochon", 
    "putain", "chienne", "douchebag", "bastardo", "cazzo", "mierda", "con", "fils de pute"
  ];
  
  // Emoji picker state
  showEmojiPicker = false;
  lastCursorPosition = 0;
  
  ngOnInit() {
    this.getCurrentUser();
    
    this.route.params.subscribe(params => {
      this.forumId = +params['id'];
      this.loadForum();
    });
  }
  // Add this new method for user images
getUserImageUrl(user: User | undefined): string {
  if (!user?.image) {
    return 'assets/images/default-avatar.png';
  }
  return `http://localhost:8080/assets/images/users/${user.image}`;
}

// Keep the existing one for forum images
getForumImageUrl(forum: Forum): string {
  if (!forum.image) {
    return 'assets/images/default-forum.jpg';
  }
  return `http://localhost:8080/assets/images/users/${forum.image}`;
}
  getCurrentUser(): void {
    const user = this.authService.currentUser;
    if (user?.id) {
      this.currentUserId = user.id;
    }
  }
  
  loadForum() {
    this.isLoading = true;
    this.forumService.getById(this.forumId).subscribe({
      next: (forum) => {
        this.forum = forum;
        this.isLoading = false;
        this.loadComments();
      },
      error: (err) => {
        console.error('Error loading forum details:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load forum details. Please try again later.';
      }
    });
  }

  loadComments() {
    if (!this.forum) return;
    
    this.commentService.getCommentsByForum(this.forumId).subscribe({
      next: (comments) => {
        this.forum!.comments = comments;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
        this.forum!.comments = [];
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

  editForum() {
    if (this.isForumOwner()) {
      this.router.navigate(['/frontoffice/forums/edit', this.forum!.id]);
    }
  }

  isForumOwner(): boolean {
    return this.forum?.userId === this.currentUserId;
  }

  deleteForum() {
    if (this.isForumOwner()) {
      this.confirmDialogService.confirm({
        title: 'Delete Forum',
        message: 'Are you sure you want to delete this forum? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }).then(confirmed => {
        if (confirmed) {
          this.forumService.delete(this.forumId).subscribe({
            next: () => {
              this.router.navigate(['/frontoffice/forums']);
            },
            error: (err) => {
              console.error('Error deleting forum:', err);
              this.errorMessage = 'Failed to delete forum. Please try again.';
            }
          });
        }
      });
    }
  }
  
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
      this.badWordError = `Forbidden word: "${foundBadWord}"`;
    } else {
      this.hasErrorWord = false;
      this.badWordError = '';
    }
  }
  
  isCommentOwner(comment: ForumComment): boolean {
    return comment.userId === this.currentUserId;
  }
  
  editComment(comment: ForumComment): void {
    if (this.isCommentOwner(comment)) {
      this.commentBeingEdited = comment;
      this.newComment = comment.content;
      this.hasErrorWord = false;
      this.badWordError = '';
      
      setTimeout(() => {
        const element = document.getElementById('comment-form');
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }
  
  cancelEditingComment(): void {
    this.commentBeingEdited = null;
    this.newComment = '';
    this.hasErrorWord = false;
    this.badWordError = '';
  }
  
  deleteComment(comment: ForumComment): void {
    if (this.isCommentOwner(comment)) {
      this.confirmDialogService.confirm({
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }).then(confirmed => {
        if (confirmed) {
          this.commentService.deleteComment(comment.id!).subscribe({
            next: () => {
              this.forum!.comments = this.forum!.comments?.filter(c => c.id !== comment.id) || [];
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
  
  addComment() {
    if (!this.newComment?.trim()) return;
    
    if (this.commentBeingEdited) {
      this.updateExistingComment();
    } else {
      this.addNewComment();
    }
  }

  private updateExistingComment(): void {
    if (!this.commentBeingEdited || !this.forum) return;

    const updatedComment: ForumComment = {
      ...this.commentBeingEdited,
      content: this.newComment,
      updatedAt: new Date().toISOString(),
      isEdited: true
    };
    
    this.commentService.updateComment(this.commentBeingEdited.id!, updatedComment).subscribe({
      next: (res) => {
        const index = this.forum!.comments?.findIndex(c => c.id === this.commentBeingEdited?.id) ?? -1;
        if (index !== -1) {
          this.forum!.comments![index] = res;
        }
        this.resetCommentForm();
      },
      error: (err) => {
        console.error('Error updating comment:', err);
        this.errorMessage = 'Failed to update comment. Please try again.';
      }
    });
  }

  private addNewComment(): void {
    if (!this.forum || !this.newComment?.trim()) return;

    const comment: ForumComment = {
      content: this.newComment,
      userId: this.currentUserId,
      forumId: this.forumId,
      createdAt: new Date().toISOString(),
      liked: 0,
      disliked: 0
    };

    this.commentService.createComment(this.forumId, comment).subscribe({
      next: (newComment) => {
        if (!this.forum!.comments) {
          this.forum!.comments = [];
        }
        this.forum!.comments.push(newComment);
        this.resetCommentForm();
      },
      error: (err) => {
        console.error('Error adding comment:', err);
        this.errorMessage = 'Failed to add comment. Please try again.';
      }
    });
  }

  private resetCommentForm(): void {
    this.commentBeingEdited = null;
    this.newComment = '';
    this.hasErrorWord = false;
    this.badWordError = '';
  }
  
  toggleEmojiPicker(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
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
      const text = textarea.value;
      this.newComment = text.substring(0, start) + emoji + text.substring(start);
      
      setTimeout(() => {
        textarea.focus();
        const newPos = start + emoji.length;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
        this.lastCursorPosition = newPos;
      }, 10);
    } else {
      this.newComment += emoji;
    }
    
    this.closeEmojiPicker();
  }
}