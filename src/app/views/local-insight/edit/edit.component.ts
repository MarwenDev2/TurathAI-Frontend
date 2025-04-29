import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { LocalInsightService } from '@core/services/local-insight.service';

@Component({
  selector: 'app-edit-local-insight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private localInsightService = inject(LocalInsightService);

  localInsightForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
    description: ['', Validators.required],
    type: ['', Validators.required],
    videoURL: [''],
    audioURL: [''],
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  localInsightId!: number;

  ngOnInit(): void {
    this.localInsightId = this.route.snapshot.params['id'];
    console.log('ID reçu:', this.localInsightId, typeof this.localInsightId);
    
    if (typeof this.localInsightId === 'string') {
      this.localInsightId = parseInt(this.localInsightId, 10);
    }
    
    this.loadLocalInsightData();
  }

  onCancel() {
    if (this.localInsightForm.dirty) {
      if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
        this.router.navigate(['/local-insight/list']);
      }
    } else {
      this.router.navigate(['/local-insight/list']);
    }
  }

  loadLocalInsightData() {
    this.isLoading = true;
    
    this.localInsightService.getLocalInsightById(this.localInsightId)
      .pipe(
        finalize(() => this.isLoading = false),
        catchError(error => {
          console.error('Erreur technique:', error);
          this.errorMessage = 'Impossible de charger les données. Veuillez réessayer plus tard.';
          return of(null); 
        })
      )
      .subscribe({
        next: (data) => {
          if (!data) {
            this.errorMessage = 'Aucune donnée trouvée pour cet ID';
            return;
          }
          
          console.log('Données reçues pour édition:', data);
          
          this.localInsightForm.patchValue({
            title: data.title || 'Sans titre',
            description: data.description || '',
            type: data.type || 'Culturel',
            videoURL: data.videoURL?.trim() || ''
          });
        },
        error: (err) => {
          console.error('Erreur dans subscribe:', err);
        }
      });
  }

  onSubmit() {
    if (this.localInsightForm.invalid) {
      this.localInsightForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    const payload = {
      ...this.localInsightForm.value,
      id: this.localInsightId
    };

    this.isLoading = true;
    this.localInsightService.updateLocalInsight(payload)
      .pipe(
        catchError(error => {
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        if (res) {
          this.successMessage = 'Modifications enregistrées avec succès';
          setTimeout(() => this.router.navigate(['/local-insight/list']), 1500);
        }
      });
  }
}