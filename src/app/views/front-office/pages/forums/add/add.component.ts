import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForumService } from '@core/services/forum.service';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  private forumService = inject(ForumService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  
  forumForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.forumForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [''],
      image: ['']
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
    const forumData = {
      ...this.forumForm.value,
      userId: 1, // Currently hardcoded user ID
      createdAt: new Date().toISOString(),
      comments: []
    };
    
    this.forumService.create(forumData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.router.navigate(['/frontoffice/forums']);
      },
      error: (err) => {
        console.error('Error creating forum:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create forum. Please try again.';
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
    this.router.navigate(['/frontoffice/forums']);
  }
}
