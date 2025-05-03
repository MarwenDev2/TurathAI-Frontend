import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoService } from '@core/services/video.service';

@Component({
  selector: 'VideoUploader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-upload-container">
      <div class="upload-area" (click)="fileInput.click()">
        <i class="fas fa-video fs-48 text-primary"></i>
        <h3 class="mt-4">Drop your video here, or <span class="text-primary">click to browse</span></h3>
        <span class="text-muted fs-13">MP4 files recommended (max 50MB)</span>
        <input #fileInput type="file" style="display: none" 
               (change)="onFileSelected($event)" 
               accept="video/*">
      </div>

      @if (uploadedVideo) {
        <div class="video-preview mt-3">
          <div class="card shadow-none border">
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  <i class="fas fa-video fs-3 text-primary"></i>
                </div>
                <div class="col ps-0">
                  <p class="mb-0 fw-bold">{{ uploadedVideo.name }}</p>
                  <p class="mb-0 text-muted">{{ uploadedVideo.size / (1024 * 1024) | number:'1.1-2' }} MB</p>
                </div>
                <div class="col-auto">
                  <button class="btn btn-sm btn-danger" (click)="removeVideo()">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (isUploading) {
        <div class="progress mt-3">
          <div class="progress-bar progress-bar-striped progress-bar-animated" 
               role="progressbar" 
               [style.width]="uploadProgress + '%'">
            {{ uploadProgress }}%
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .video-upload-container {
      border: 2px dashed #0087F7;
      border-radius: 5px;
      background: white;
      padding: 20px;
      text-align: center;
    }
    .upload-area {
      cursor: pointer;
      padding: 20px;
    }
    .video-preview {
      text-align: left;
    }
    .progress {
      height: 20px;
    }
  `]
})
export class VideoUploaderComponent {
  @Output() videoUploaded = new EventEmitter<{ url: string; originalName: string }>(); // Emits the video ID
  @Output() videoRemoved = new EventEmitter<void>();

  uploadedVideo: { id: number, name: string, size: number } | null = null;
  isUploading = false;
  uploadProgress = 0;

  constructor(private videoService: VideoService) {}

uploadVideo(file: File) {
  this.isUploading = true;
  this.uploadProgress = 0;

  this.videoService.uploadVideo(file).subscribe({
    next: (response) => {
      this.uploadedVideo = {
        id: response.id || 0, // use response.id only if backend returns it
        name: file.name,
        size: file.size
      };
      this.videoUploaded.emit({url: response.url || 0, originalName: file.name});
      this.isUploading = false;
    },
    error: (err) => {
      console.error('Video upload failed', err);
      this.isUploading = false;
      alert('Failed to upload video. Please try again.');
    }
  });
}


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }

      // Validate file size (e.g., 50MB max)
      if (file.size > 200 * 1024 * 1024) {
        alert('Video file is too large. Maximum size is 200MB.');
        return;
      }

      this.uploadVideo(file);
    }
  }


  removeVideo() {
    this.uploadedVideo = null;
    this.videoRemoved.emit();
  }
}