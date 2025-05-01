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
  @Input() slideInterval: number = 5000; // 5 seconds
  @Input() showHeroSection: boolean = true;
  @Input() heroTitle: string = 'Welcome to TurathAI';
  @Input() heroDescription: string = 'Explore the rich cultural heritage and historical significance of our region\'s most treasured landmarks';
  @Input() heroButtonText: string = 'Explore Now';
  
  currentSlide = 0;
  private autoSlideInterval: any;

  constructor() {}

  ngOnInit(): void {
    if (this.autoSlide) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
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
