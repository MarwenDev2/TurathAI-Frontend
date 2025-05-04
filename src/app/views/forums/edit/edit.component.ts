import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  forumId!: number;
  forum: Forum = {
    id: 0,
    title: '',
    description: '',
    image: '',
    userId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    this.forumId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Forum ID récupéré:', this.forumId);

    this.forumService.getById(this.forumId).subscribe({
      next: (data) => {
        this.forum = data;
        console.log('Forum chargé:', this.forum);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du forum', err);
      }
    });
  }

  updateForum(): void {
    console.log('Mise à jour déclenchée'); // ← Test
    console.log(this.forum); // ← Test des données
  
    this.forumService.update(this.forumId, this.forum).subscribe({
      next: () => {
        console.log('Forum mis à jour avec succès');
        this.router.navigate(['/forums']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du forum', err);
      }
    });
  }
  

  cancel(): void {
    this.router.navigate(['/forums']);
  }
}
