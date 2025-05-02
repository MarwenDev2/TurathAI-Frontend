import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { RecommendedSitesComponent } from '../../components/recommended-sites/recommended-sites.component';

@Component({
  selector: 'app-front-office-home',
  standalone: true,
  imports: [CommonModule, CarouselComponent, RecommendedSitesComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class FrontOfficeHomeComponent implements OnInit {
  carouselSlides = [
    { image: 'assets/images/carousel/Tunis-Medina-Panorama-View.jpg' },
    { image: 'assets/images/carousel/tunisia-travel-guide-64.jpg' },
    { image: 'assets/images/carousel/amphitheatre of El Jem.jpg' },
    { image: 'assets/images/carousel/bouhlel-canyons-hike.jpg' },
    { image: 'assets/images/carousel/El-Jem-Amphitheatre.jpg' },
    { image: 'assets/images/carousel/images.jpeg' },
    { image: 'assets/images/carousel/download (3).jpeg' },
    { image: 'assets/images/carousel/Monastir-tunisia.jpg' },
    { image: 'assets/images/carousel/60bbde55.jpg' },
    { image: 'assets/images/carousel/tunisia-travel-guide-64.jpg' },
    { image: 'assets/images/carousel/Tunis-Medina-Panorama-View.jpg' },
    
  ];

  constructor() {}

  ngOnInit(): void {}
}
