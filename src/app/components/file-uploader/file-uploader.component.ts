import { Component, EventEmitter, Input,Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ImageSService } from '@core/services/imageS.service';
import { CommonModule, DecimalPipe } from '@angular/common';


type UploadedFile = {
  id: number;
  name: string;
  size: number;
  type: string;
  dataURL?: string;
};

@Component({
  selector: 'FileUploader',
  standalone: true,
  imports: [CommonModule], // Add this
  providers: [DecimalPipe], // Add this
  template: `
    <div class="dropzone" (click)="fileInput.click()">
      <div class="dz-message needsclick">
        <i class="bx bx-cloud-upload fs-48 text-primary"></i>
        <h3 class="mt-4">Drop your images here, or <span class="text-primary">click to browse</span></h3>
        <span class="text-muted fs-13">1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed</span>
      </div>
      <input #fileInput type="file" style="display: none" (change)="onFileSelected($event)" accept="image/*" multiple>
    </div>

     <!-- Display existing images -->
     @if (existingImageIds && existingImageIds.length > 0) {
      <div class="dropzone-previews mt-3">
        @for (imageId of existingImageIds; track imageId) {
          <div class="card mt-1 mb-0 shadow-none border">
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img [src]="getImageUrl(imageId)" class="avatar-sm rounded bg-light" />
                </div>
                <div class="col ps-0">
                  <a class="text-muted fw-bold">Existing Image</a>
                </div>
                <div class="col-auto">
                  <button (click)="removeExistingImage(imageId)" class="btn btn-sm btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }

     <!-- Display newly uploaded files -->
     @if (uploadedFiles.length > 0) {
      <div class="dropzone-previews mt-3">
        @for (file of uploadedFiles; track $index) {
          <div class="card mt-1 mb-0 shadow-none border">
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  <img [src]="file.dataURL" class="avatar-sm rounded bg-light" />
                </div>
                <div class="col ps-0">
                  <a class="text-muted fw-bold">{{ file.name }}</a>
                  <p class="mb-0"><strong>{{ file.size / 1024 | number:'1.0-2' }}</strong> KB</p>
                </div>
                <div class="col-auto">
                  <button (click)="removeFile($index)" class="btn btn-sm btn-primary">Delete</button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .dropzone {
      border: 2px dashed #0087F7;
      border-radius: 5px;
      background: white;
      padding: 54px 54px;
      text-align: center;
      cursor: pointer;
    }
  `]
})
export class FileUploaderComponent {
  @Input() existingImageIds: number[] = []; // Add this input property  
  @Output() imageIdsChange = new EventEmitter<number[]>();

  uploadedFiles: UploadedFile[] = [];


  constructor(private imageService: ImageSService) {}

  getImageUrl(id: number): string {
    return this.imageService.getImageUrl(id);
  }

  removeExistingImage(id: number): void {
    this.existingImageIds = this.existingImageIds.filter(imgId => imgId !== id);
    this.emitImageIds();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        this.uploadFile(file);
      });
    }
  }

  uploadFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const tempFile: UploadedFile = {
        id: 0, // temporary until we get real ID
        name: file.name,
        size: file.size,
        type: file.type,
        dataURL: e.target.result
      };
      this.uploadedFiles.push(tempFile);
      
      // Upload to backend
      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          // Update with real ID from backend
          const index = this.uploadedFiles.findIndex(f => f.name === file.name);
          if (index !== -1) {
            this.uploadedFiles[index].id = response.id;
            this.emitImageIds();
          }
        },
        error: (err) => {
          console.error('Upload failed', err);
          // Remove the file if upload fails
          this.uploadedFiles = this.uploadedFiles.filter(f => f.name !== file.name);
        }
      });
    };
    reader.readAsDataURL(file);
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.emitImageIds();
  }

  private emitImageIds() {
    const ids = this.uploadedFiles.map(file => file.id);
    this.imageIdsChange.emit(ids);
  }
}