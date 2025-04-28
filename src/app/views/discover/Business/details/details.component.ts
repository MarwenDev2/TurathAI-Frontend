import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BusinessService } from '@core/services/business.service';
import { Business } from '@core/Models/business';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-business-details',
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
  business?: Business;
  selectedImageUrl: string | null = null;
  lightboxModal: Modal | null = null;
  isLoading = false;
  imageUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadBusinessDetails(id);
    });
  }

  loadBusinessDetails(id: number): void {
    this.isLoading = true;
    this.businessService.getBusinessById(id).subscribe({
      next: (business) => {
        this.business = business;
        console.log('Loaded business:', business); // Debug log
        
        // Handle both image structures
        if (business.images && business.images.length > 0) {
          // Using the images array from API
          this.imageUrls = business.images.map(img => `${this.businessService.getImageBaseUrl()}/${img.id}`);
          console.log('Image URLs from images array:', this.imageUrls);
        } else if (business.imageIds && business.imageIds.length > 0) {
          // Using the imageIds array
          this.imageUrls = business.imageIds.map(id => this.getImageUrl(id));
          console.log('Image URLs from imageIds:', this.imageUrls);
        } else {
          this.imageUrls = [];
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading business details:', error);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(imageId: number): string {
    return `${this.businessService.getImageBaseUrl()}/${imageId}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-business.jpg';
  }

  openLightbox(index: number): void {
    // Use the pre-constructed URL from the imageUrls array
    if (index >= 0 && index < this.imageUrls.length) {
      this.selectedImageUrl = this.imageUrls[index];
      this.lightboxModal = new Modal(document.getElementById('imageLightbox') as HTMLElement);
      this.lightboxModal.show();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file: File = input.files[0];
    this.businessService.uploadImage(file).subscribe({
      next: (response) => {
        if (!this.business?.id) return;
        
        console.log('Image uploaded:', response);
        // Here you would add logic to associate the image with the business
        // This would depend on your API design
        this.loadBusinessDetails(this.business.id);
      },
      error: (err) => console.error('Upload failed:', err)
    });
  }
}