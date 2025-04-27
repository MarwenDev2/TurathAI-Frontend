import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService } from '@core/services/event.service';
import { EventSite } from '@core/Models/event';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgbCarouselModule
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  event?: EventSite;
  selectedImageUrl: string | null = null;
  lightboxModal: Modal | null = null;
  isLoading = false;
  imageUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadEventDetails(id);
    });
  }

  loadEventDetails(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.event = event;
        console.log('Loaded event:', event); // Debug log
        
        // Handle both image structures
        if (event.images && event.images.length > 0) {
          // Using the images array from API
          this.imageUrls = event.images.map(img => `${this.eventService.getImageBaseUrl()}/${img.id}`);
          console.log('Image URLs from images array:', this.imageUrls);
        } else if (event.imageIds && event.imageIds.length > 0) {
          // Using the imageIds array
          this.imageUrls = event.imageIds.map(id => this.getImageUrl(id));
          console.log('Image URLs from imageIds:', this.imageUrls);
        } else {
          this.imageUrls = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imageId: number): string {
    return `${this.eventService.getImageBaseUrl()}/${imageId}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-event.jpg';
  }

  openLightbox(index: number): void {
    // Use the pre-constructed URL from the imageUrls array
    if (index >= 0 && index < this.imageUrls.length) {
      this.selectedImageUrl = this.imageUrls[index];
      this.lightboxModal = new Modal(document.getElementById('imageLightbox') as HTMLElement);
      this.lightboxModal.show();
    }
  }

  isUpcoming(event: EventSite): boolean {
    return new Date(event.startDate) > new Date();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file: File = input.files[0];
    this.eventService.uploadImage(file).subscribe({
      next: (response) => {
        if (!this.event?.id) return;
        
        console.log('Image uploaded:', response);
        this.eventService.addImageToEvent(this.event.id, response.id).subscribe({
          next: () => {
            this.loadEventDetails(this.event!.id!);
          },
          error: (err) => console.error('Failed to add image to event:', err)
        });
      },
      error: (err) => console.error('Upload failed:', err)
    });
  }
}