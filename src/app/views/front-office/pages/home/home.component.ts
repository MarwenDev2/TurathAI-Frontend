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
    {
      title: 'Easy Management',
      description: 'Streamline your business operations with our intuitive management tools',
      icon: '📊'
    },
    {
      title: 'Real-time Updates',
      description: 'Stay informed with real-time updates and notifications',
      icon: '⚡'
    },
    {
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security',
      icon: '🔒'
    }
  ];

  carouselSlides = [
    {
      image: 'assets/images/carousel/slide1.jpg',
      title: 'Welcome to Our Platform',
      description: 'Discover the power of our comprehensive business solution'
    },
    {
      image: 'assets/images/carousel/slide2.jpg',
      title: 'Streamline Your Workflow',
      description: 'Efficient tools to boost your productivity'
    },
    {
      image: 'assets/images/carousel/slide3.jpg',
      title: 'Connect with Your Team',
      description: 'Collaborate seamlessly with your colleagues'
    }
  ];

  currentSlide = 0;
  autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
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