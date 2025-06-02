import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { LocalInsightService } from '@core/services/local-insight.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@core/services/auth.service';
import { VideoUploaderComponent } from '@component/file-uploader/video-uploader.component';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';

@Component({
  selector: 'app-add-local-insight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, VideoUploaderComponent],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private localInsightService = inject(LocalInsightService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private siteService = inject(SiteService);

  localInsightForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\u00C0-\u017F\s]+$/)]],
    description: ['', Validators.required],
    type: ['', Validators.required],
    videoURL: [''],
    videoOriginalName: [''],
    heritageSiteId: ['', Validators.required]
  });

  heritageSite: any = null;
  heritageSites: Site[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  uploadedVideoId: string | null = null;

  ngOnInit(): void {
    this.fetchHeritageSites();
  }

  fetchHeritageSites(): void {
    this.siteService.getAll().subscribe({
      next: (data) => this.heritageSites = data,
      error: () => this.errorMessage = 'Impossible de charger les sites patrimoniaux.'
    });
  }

  // onVideoUploaded(response: { fileName: string; originalName: string }): void {
  //   this.uploadedVideoId = response.fileName;
  //   const videoURL = `${response.fileName}`;
  //   this.localInsightForm.patchValue({ 
  //     videoURL,
  //     videoOriginalName: response.originalName
  //   });
  //   this.errorMessage = '';
  //   this.successMessage = 'Vidéo téléchargée avec succès!';
  // }
  onVideoUploaded(event: { url: string, originalName: string }) {
    this.localInsightForm.patchValue({
      videoURL: event.url,
      videoOriginalName: event.originalName
    });
  }
  
  onVideoRemoved(): void {
    this.uploadedVideoId = null;
    this.localInsightForm.patchValue({ 
      videoURL: '',
      videoOriginalName: ''
    });
    this.successMessage = 'Vidéo supprimée avec succès!';
    setTimeout(() => this.successMessage = '', 3000);
  }

  onTypeChange(type: string): void {
    if (!type) return;
    this.http.post<any>('${environment.apiUrl}/api/local-insights/videos/generate', { type }).subscribe({
      next: (res) => {
        if (res.videoURL) {
          this.localInsightForm.patchValue({ 
            videoURL: res.videoURL,
            videoOriginalName: res.videoURL.split('/').pop() || 'Generated Video'
          });
          this.successMessage = 'Vidéo générée automatiquement.';
        }
      },
      error: () => this.errorMessage = 'Erreur lors de la génération de la vidéo.'
    });
  }

  onSubmit(): void {
    if (this.localInsightForm.invalid) {
      this.localInsightForm.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    this.isLoading = true;
    const formValue = this.localInsightForm.value;
    const currentUser = this.authService.currentUser;

    // Log the form values to verify they're being captured correctly
    console.log('Form values:', formValue);
    
    // Try both structures to ensure compatibility
    const payload = {
      title: formValue.title,
      description: formValue.description,
      type: formValue.type,
      videoURL: formValue.videoURL || null,
      videoOriginalName: formValue.videoOriginalName || null,
      // Send both formats to ensure compatibility with backend
      heritageSite: {
        id: Number(formValue.heritageSiteId) || null
      },
      heritageSiteId: Number(formValue.heritageSiteId) || null
    };
    
    console.log('Sending payload:', payload);

    this.localInsightService.createLocalInsight(payload)
      .pipe(
        // switchMap(createdInsight => {
        //   if (createdInsight && currentUser) {
        //     const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        //     return this.localInsightService.sendLocalInsightNotification(
        //       createdInsight.id!,
        //       currentUser.email,
        //       fullName
        //     ).pipe(
        //       catchError(error => {
        //         console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        //         return of(createdInsight);
        //       })
        //     );
        //   }
        //   return of(createdInsight);
        // }),
        // catchError(error => {
        //   this.errorMessage = error.error?.message || 'Erreur lors de l\'ajout.';
        //   return of(null);
        // }),
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
    if (this.localInsightForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler? Les modifications non enregistrées seront perdues.')) {
        this.router.navigate(['/local-insight/list']);
      }
    } else {
      this.router.navigate(['/local-insight/list']);
    }
  }
}