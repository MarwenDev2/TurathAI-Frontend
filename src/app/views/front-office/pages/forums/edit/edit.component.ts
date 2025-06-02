import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '@core/services/forum.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  private forumService = inject(ForumService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  forumForm!: FormGroup;
  isLoading = true;
  isSubmitting = false;
  errorMessage: string = '';
  forumId: number = 0;
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  
  // Stocker le forum original complet
  originalForum: any = null;
  
  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(params => {
      this.forumId = +params['id'];
      
      // Essayer d'abord de récupérer les données du localStorage
      const storedForum = localStorage.getItem('editingForum');
      if (storedForum) {
        try {
          this.originalForum = JSON.parse(storedForum);
          console.log('Forum récupéré du localStorage:', this.originalForum);
          
          // Remplir le formulaire avec les données du localStorage
          this.forumForm.patchValue({
            title: this.originalForum.title,
            description: this.originalForum.description,
            image: this.originalForum.image
          });
          
          if (this.originalForum.image) {
            this.imagePreview = `${environment.apiUrl}/assets/images/users/${this.originalForum.image}`;
          }
          
          this.isLoading = false;
        } catch (e) {
          console.error('Erreur lors de la récupération du forum depuis localStorage:', e);
          // En cas d'erreur, charger depuis l'API comme fallback
          this.loadForum();
        }
      } else {
        // Si rien dans localStorage, charger depuis l'API
        this.loadForum();
      }
    });
  }
  
  initForm() {
    this.forumForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [''],
      image: ['']
    });
  }
  
  loadForum() {
    this.isLoading = true;
    this.forumService.getById(this.forumId).subscribe({
      next: (data: any) => {
        // Stocker le forum original complet
        this.originalForum = { ...data };
        
        console.log('Forum original chargé:', this.originalForum);
        
        this.forumForm.patchValue({
          title: data.title,
          description: data.description,
          image: data.image
        });
        
        if (data.image) {
          this.imagePreview = `${environment.apiUrl}/assets/images/users/${data.image}`;
        }
        
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading forum:', err);
        this.isLoading = false;
        this.errorMessage = 'Failed to load forum. Please try again later.';
      }
    });
  }
  
  onSubmit() {
    if (this.forumForm.invalid) {
      Object.keys(this.forumForm.controls).forEach(key => {
        const control = this.forumForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }
    
    this.isSubmitting = true;
    
    // Récupérer les valeurs actuelles du formulaire
    const formValues = this.forumForm.value;
    
    // Créer un objet forum complet avec toutes les propriétés originales
    const completeForumData = {
      ...this.originalForum,
      title: formValues.title || this.originalForum.title, // Garantir que le titre est présent
      // Ne remplacer la description que si elle est explicitement fournie, sinon conserver l'originale
      description: (formValues.description !== null && formValues.description !== undefined && formValues.description !== '') 
        ? formValues.description 
        : this.originalForum.description,
      image: formValues.image || this.originalForum.image
    };
    
    console.log('Données complètes du forum pour mise à jour:', completeForumData);
    
    // Utiliser la méthode standard update avec les données complètes
    this.forumService.update(this.forumId, completeForumData).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Nettoyer le localStorage après mise à jour réussie
        localStorage.removeItem('editingForum');
        this.router.navigate(['/frontoffice/forums/details', this.forumId]);
      },
      error: (err: any) => {
        console.error('Error updating forum:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update forum. Please try again.';
      }
    });
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      
      // Set the file name to the form
      this.forumForm.patchValue({
        image: this.selectedFile.name
      });
    }
  }
  
  goBack() {
    this.router.navigate(['/frontoffice/forums/details', this.forumId]);
  }
}
