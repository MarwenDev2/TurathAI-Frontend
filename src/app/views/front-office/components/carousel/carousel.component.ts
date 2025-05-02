import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface CarouselSlide {
  id?: number;
  image: string;
  title?: string;
  description?: string;
  link?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: CarouselSlide[] = [];
  @Input() autoSlide: boolean = true;
  @Input() slideInterval: number = 5000;
  
  currentSlide = 0;
  currentImageTransform = 'scale(1)';
  hoveredSlideIndex: number | null = null;
  private autoSlideInterval: any;
  
  checkImageLoad(index: number): void {
    const img = new Image();
    img.src = this.slides[index].image;
    img.onload = () => console.log(`Image ${index} loaded successfully`);
    img.onerror = () => console.error(`Error loading image ${index}: ${this.slides[index].image}`);
  }

  ngOnInit(): void {
    if (this.autoSlide) {
      this.startAutoSlide();
    }
    // Check all images on init
    this.slides.forEach((_, i) => this.checkImageLoad(i));
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  onSlideHover(index: number, isHovering: boolean): void {
    this.hoveredSlideIndex = isHovering ? index : null;
    this.currentImageTransform = isHovering ? 'scale(1.03)' : 'scale(1)';
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prevSlide(): void {
    this.stopAutoSlide();
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.stopAutoSlide();
    this.currentSlide = index;
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }
}
