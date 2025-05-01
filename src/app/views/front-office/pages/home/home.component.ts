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
    { image: 'assets/images/carousel/tunisia-2_2.jpg' },
    { image: 'assets/images/carousel/tunisia-1_2.jpg' },
    { image: 'assets/images/carousel/shu-Tunisia-SidiBouSaid-760300645-1440x823' },
    { image: 'assets/images/carousel/images.jpeg' },
    { image: 'assets/images/carousel/download (3).jpeg' },
    { image: 'assets/images/carousel/1213a0c2-city-32784-16b8fc4f8fa.jpg' },
    { image: 'assets/images/carousel/60bbde55.jpg' },
    { image: 'assets/images/carousel/Monastir-tunisia.jpg' },
    { image: 'assets/images/carousel/El-Jem-Amphitheatre.jpg' },
    
  ];

  constructor() {}

  ngOnInit(): void {}
}
