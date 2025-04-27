import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { ForumService } from '@core/services/forum.service';
import { Forum } from '@core/Models/forum';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-add-forum',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);
  private http = inject(HttpClient);
  private userService = inject(UserService);

  forumForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    image: ['']
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  previewUrl: string | null = null;
  imageFileName: string | null = null;

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('image', file);

    if (!file.type.match('image.*')) {
      this.errorMessage = 'Seuls les fichiers image sont autorisés.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage = 'L\'image doit faire moins de 2 Mo.';
      return;
    }

    this.errorMessage = '';

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.http.post<{ fileName: string, url: string }>('http://localhost:8081/api/upload', formData)
      .subscribe({
        next: (data) => {
          this.imageFileName = data.fileName;
          this.forumForm.patchValue({ image: this.imageFileName });
        },
        error: () => {
          this.errorMessage = 'Erreur lors du téléversement de l\'image.';
        }
      });
  }

  onSubmit(): void {
    if (this.forumForm.invalid) {
      this.forumForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userId = 1;

    this.userService.getUserById(userId).pipe(
      catchError(() => {
        this.errorMessage = 'Erreur utilisateur.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(user => {
      if (!user) return;

      const newForum: Forum = {
        title: this.forumForm.value.title,
        description: this.forumForm.value.description,
        image: this.forumForm.value.image,
        user: user
      };

      this.forumService.create(newForum).pipe(
        catchError(err => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        if (res) {
          this.successMessage = 'Forum ajouté avec succès !';
          this.router.navigate(['../list'], { relativeTo: this.route, state: { refresh: true } });
        }
      });
    });
  }

  // 👉 Bouton "Voir la liste"
  goToList(): void {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }
}