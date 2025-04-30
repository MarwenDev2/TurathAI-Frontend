import { Component, OnInit, inject } from '@angular/core';
import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommentService } from '@core/services/comment.service';
import { FormsModule } from '@angular/forms';
import { ForumComment } from '@core/Models/forumComment';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-list-forums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  private forumService = inject(ForumService);
  private commentService = inject(CommentService);
  private router = inject(Router);
  constructor(private addservice: CommentService) {}

  //forums: Forum[] = [];
  forums: any[] = [];
  currentUserId = 1;
  isLoading = true;
  selectedForum: Forum | null = null;
  menuPosition = { x: 0, y: 0 };
  showConfirmationDialog = false;
  forumToDelete: Forum | null = null;
  contextMenuVisible = false;
contextMenuPosition = { x: 0, y: 0 };
selectedComment: any = null;
editingComment: any = null;
selectedForumm: any = null;
errorMessage: string = ''; 

  ngOnInit(){
    this.forumService.getAll().subscribe({
      next: (data) => {
        this.forums = data;
        this.isLoading = false;
        this.forums.forEach(forum => {
          forum.showComments = false;
          forum.comments = [];
          this.loadComments(forum);
        });
      },
      error: (err: unknown) => {
        console.error('Erreur lors du chargement des forums', err);
        this.isLoading = false;
      }
    });
    window.addEventListener('click', () => {
      this.closeContextMenu();
    });
  }
  loadForums() {
    this.forumService.getAll().subscribe((data) => {
      this.forums = data;
    });
  }
  
openContextMenu(event: MouseEvent, comment: any) {
  event.preventDefault();
  this.contextMenuVisible = true;
  this.menuPosition = { x: event.clientX, y: event.clientY };
  this.editingComment = comment;
  this.selectedForumm = comment.forum;

  // Empêcher la fermeture immédiate du menu lors du clic
  this.contextMenuVisible = true;
}
  
  closeContextMenu() {
    this.contextMenuVisible = false;
    this.selectedComment = null;
  }
  deleteComment(comment: ForumComment) {
    if (comment && comment.id) {
      this.commentService.deleteComment(comment.id).subscribe({
        next: () => {
          // Après suppression, enlever le commentaire de la liste affichée
          for (const forum of this.forums) {
            forum.comments = forum.comments.filter((c: ForumComment) => c.id !== comment.id);
          }
          this.closeContextMenu();
          this.editingComment = null; 
        },
        error: (err) => {
          console.error('Erreur suppression commentaire:', err);
          this.closeContextMenu();
        }
      });
    }
  }
  creerComment(forum: any) {
    const BAD_WORDS = [
      "insulte", "abus", "violence", "fuck", "fucker", "raciste", "hate", "nazi",
      "bitch", "asshole", "idiot", "stupid", "puta", "mrd", "schwein", "cochon", 
      "putain", "chienne", "douchebag", "bastardo", "cazzo", "mierda", "con", "fils de pute"
  ];

  // Vérifier si le commentaire contient un mot interdit
  const containsBadWord = BAD_WORDS.some(word => forum.newComment.toLowerCase().includes(word));

  if (containsBadWord) {
      this.errorMessage = 'Le commentaire contient des mots interdits.';
      forum.newComment = '';
      return; // Ne pas envoyer le commentaire si un mot interdit est détecté
  }
  this.errorMessage = '';

    if (!forum.id) {
      console.error('ID du forum manquant');
      return;
    }
  
    if (this.editingComment) {
      // MODE MODIFICATION
      const updatedComment = {
        ...this.editingComment,
        content: forum.newComment,
      };
  
      this.commentService.updateComment(this.editingComment.id, updatedComment).subscribe({
        next: (res) => {
          const index = forum.comments.findIndex((c: any) => c.id === this.editingComment.id);
          if (index !== -1) {
            forum.comments[index] = res;
          }
          this.editingComment = null;
          forum.newComment = '';
        },
        error: (err) => {
          console.error('Erreur modification commentaire :', err);
        }
      });
    } else {
      // MODE AJOUT
      const comment = {
        content: forum.newComment,
        image: '',
        userId: this.currentUserId,
        forumId: forum.id,
        createdAt: new Date().toISOString(),
        liked: 0,
        disliked: 0
      };
  
      this.commentService.addComment(forum.id, comment).subscribe({
        next: (res) => {
          forum.comments.push(res);
          forum.newComment = '';
        },
        error: (err) => {
          console.error('Erreur ajout commentaire :', err);
        }
      });
    }
  }
  startEditingComment(comment: any, forum: any) {
    this.editingComment = comment;
    forum.newComment = comment.content;
    this.selectedForumm = forum;
    this.contextMenuVisible = false; 
  }
  
  

  loadComments(forum: Forum): void {
    this.commentService.getByForumId(forum.id!).subscribe({
      next: (comments: ForumComment[]) => {
        forum.comments = comments;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commentaires', err);
      }
    });
  }

  commentOnForum(forum: Forum): void {
    forum.showComments = !forum.showComments;
  }

  

 // Update your getImageUrl method:
getImageUrl(forum: Forum): string {
  if (!forum.image) {
    return 'assets/images/default-forum.jpg';
  }
  
  // Try using the full URL instead of a relative path
  if (forum.image.startsWith('http')) {
    return forum.image;
  }
  
  // If you have headers available from your auth service
  // return `http://localhost:8080/images/${forum.image}`;
  
  // Or, if images are stored as static assets on your server:
  return `http://localhost:8080/assets/images/forums/${forum.image}`;
}

  deleteForum(forumId: number): void {
    if (forumId !== undefined) {
      this.forumService.delete(forumId).subscribe({
        next: () => {
          console.log('Forum supprimé avec succès');
          this.forums = this.forums.filter(forum => forum.id !== forumId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du forum', err);
        }
      });
    } else {
      console.error('Forum ID is undefined');
    }
  }

  confirmDelete(forum: Forum): void {
    this.showConfirmationDialog = true;
    this.forumToDelete = forum;
  }

  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.forumToDelete = null;
  }

  confirmDeleteAction(): void {
    if (this.forumToDelete) {
      this.deleteForum(this.forumToDelete.id!);
    }
    this.cancelDelete();
  }

  editForum(forum: Forum): void {
    this.router.navigate(['/forums/edit', forum.id]);
  }
}