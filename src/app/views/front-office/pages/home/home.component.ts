import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-front-office-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class FrontOfficeHomeComponent implements OnInit, OnDestroy {
  features = [
    { title: 'Easy Management', description: 'Streamline your business operations with our intuitive management tools', icon: '📊' },
    { title: 'Real-time Updates', description: 'Stay informed with real-time updates and notifications', icon: '⚡' },
    { title: 'Secure Platform', description: 'Your data is protected with enterprise-grade security', icon: '🔒' }
  ];

  carouselSlides: { image: string; title: string; description: string; }[] = [];
  currentSlide = 0;
  autoSlideInterval: any;

  ngOnInit() {
    this.loadCarouselSlides();
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  loadCarouselSlides() {
    const imageNames = [
      'Tunis-Medina-Panorama-View.jpg',
      'tunisia-travel-guide-64.jpg',
      'tunisia-2_2.jpg',
      'tunisia-1_2.jpg',
      'shu-Tunisia-SidiBouSaid-760300645-1440x823',
      'images.jpeg',
      'download (3).jpeg',
      'tunisia.jpg',
      '1213a0c2-city-32784-16b8fc4f8fa.jpg'
    ];

    this.carouselSlides = imageNames.map((name, index) => ({
      image: `/assets/images/carousel/${name}`,
      title: `Slide ${index + 1}`,
      description: `Description for slide ${index + 1}`
    }));
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.carouselSlides.length) % this.carouselSlides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }
}
