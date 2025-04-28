import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { LocalInsightService } from '@core/services/local-insight.service';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { User } from '@core/Models/user';

@Component({
  selector: 'app-add-local-insight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private localInsightService = inject(LocalInsightService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  localInsightForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    videoURL: [''],
  });

  heritageSite: any = null; // On va stocker l'objet complet ici

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedImage: string | ArrayBuffer | null = null;
  imageFileName: string | null = null;
  isGeneratingDescription = false;

  ngOnInit(): void {
    this.fetchHeritageSite();
  }

  fetchHeritageSite() {
    this.http.get<any>('http://localhost:8080/api/Sites/get/1').subscribe({
      next: (data) => {
        this.heritageSite = data;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le site patrimonial.';
      }
    });
  }

  onTypeChange(type: string) {
    this.http.post<any>('http://localhost:8080/api/local-insights/videos/generate', { type }).subscribe({
      next: (res) => {
        // On met à jour le champ 'videoURL' avec l'URL de la vidéo générée
        this.localInsightForm.patchValue({ videoURL: res.videoURL });
        this.successMessage = 'Vidéo générée automatiquement.';
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la génération de la vidéo.';
      }
    });
  }

  onSubmit() {
    if (this.localInsightForm.invalid) {
      this.localInsightForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    const formValue = this.localInsightForm.value;

    const payload = {
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      videoURL: formValue.videoURL || null,
      heritageSite: {
        id: this.heritageSite?.id || 2
      }
    };

    this.isLoading = true;
    const currentUser = this.authService.currentUser;

    this.localInsightService.createLocalInsight(payload)
      .pipe(
        switchMap(createdInsight => {
          // Only send notification if we have a user and the insight was created successfully
          if (createdInsight && currentUser) {
            // Get user's full name
            const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
            
            // Send email notification
            return this.localInsightService.sendLocalInsightNotification(
              createdInsight.id!, 
              currentUser.email,
              fullName
            ).pipe(
              catchError(error => {
                console.error('Error sending notification email:', error);
                // Return the created insight even if email fails
                return of(createdInsight);
              })
            );
          }
          return of(createdInsight);
        }),
        catchError(error => {
          this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        if (res) {
          this.successMessage = 'Insight ajouté avec succès. Un email de confirmation a été envoyé.';
          setTimeout(() => this.router.navigate(['/local-insight/list']), 2000);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/local-insight/list']);
  }
}