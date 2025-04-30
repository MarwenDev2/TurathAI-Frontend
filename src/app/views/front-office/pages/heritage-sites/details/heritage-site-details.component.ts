import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Stop } from '@core/Models/stop';
import { StopService } from '@core/services/stop.service';
import { Itinery } from '@core/Models/itinerary';
import { CommonModule } from '@angular/common';
import { SiteService } from '@core/services/site.service';
import { Site } from '@core/Models/site';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { HeritageSiteImageComponent } from './components/site-image/site-image.component';
import { HeritageSiteInfoComponent } from './components/site-info/site-info.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { CategoryService } from '@core/services/category.service';
register();

@Component({
  selector: 'app-heritage-site-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NgbRatingModule,
    HeritageSiteImageComponent,
    HeritageSiteInfoComponent,
    ReviewsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './heritage-site-details.component.html',
  styleUrls: ['./heritage-site-details.component.scss']
})
export class HeritageSiteDetailsComponent implements OnInit {
  siteData!: Site;
  siteId!: number;
  siteImages: string[] = [];
  categoriesMap = new Map<number, string>();
  currentSlide = 0;
  featuredSites: Site[] = [];
  relatedItineraries: Itinery[] = [];



  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: true
  };

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService,
    private stopService: StopService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      console.log('Route param id:', idParam);
      if (idParam) {
        this.siteId = +idParam;
        console.log('Loading site with id:', this.siteId);
        this.loadSiteDetails();
      } else {
        console.error('No ID parameter found in route');
      }
    });
    this.loadData();
    
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));
    });
  }

  loadSiteDetails() {
    console.log('Attempting to fetch site with ID:', this.siteId);
    this.siteService.getById(this.siteId).subscribe({
      next: (site: Site) => {
        console.log('Fetched site details:', site);
        this.siteData = site;
        this.loadRelatedItineraries();
      },
      error: (error) => {
        console.error('Error loading site details:', error);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || 'Unknown';
  }

   prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.featuredSites.length) % this.featuredSites.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.featuredSites.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  loadRelatedItineraries() {
    this.stopService.getBySiteId(this.siteId).subscribe({
      next: (stops: Stop[]) => {
        // Extract unique itineraries from stops
        this.relatedItineraries = stops
          .filter(stop => stop.itinery)
          .map(stop => stop.itinery!)
          .filter((itinery, index, self) => 
            index === self.findIndex((t) => t.id === itinery.id)
          );
        console.log('Related itineraries:', this.relatedItineraries);
      },
      error: (error: any) => {
        console.error('Error loading related itineraries:', error);
      }
    });
  }

    getSiteImage(imageIds: number[] | undefined): string {
    if (!imageIds || imageIds.length === 0) {
      return 'assets/images/default-site.jpg';
    }
    return `http://localhost:8080/images/${imageIds[0]}`;
  }
} 