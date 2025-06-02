import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { TopReviewComponent } from './components/top-review/top-review.component';
import { SiteInfoComponent } from './components/site-info/site-info.component';
import { FeatureComponent } from './components/feature/feature.component';
import { SiteImageComponent } from './components/site-image/site-image.component';
import { RelatedBusinessComponent } from './components/related-business/related-business.component';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '@core/services/site.service';
import { CategoryService } from '@core/services/category.service';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Site } from '@core/Models/site';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    SiteInfoComponent,
    ItemDetailComponent,
    TopReviewComponent,
    SiteImageComponent,
    FeatureComponent,
    RelatedBusinessComponent,
  ],
  templateUrl: './details.component.html',
  styleUrls: []
})
export class DetailsComponent implements OnInit {
  title = 'HERITAGE SITE DETAILS';

  relatedBusinesses = [
    {
      id: 1,
      name: 'Luxury Hotel & Spa',
      type: 'Hotel',
      contact: '+1234567890',
      latitude: 25.2048,
      longitude: 55.2708,
      id_site: 1,
      image: 'assets/images/hotel.jpg',
      rating: 4.5,
      reviewCount: 120
    },
    {
      id: 2,
      name: 'Fine Dining Restaurant',
      type: 'Restaurant',
      contact: '+1234567891',
      latitude: 25.2049,
      longitude: 55.2709,
      id_site: 1,
      image: 'assets/images/restaurant.jpg',
      rating: 4.8,
      reviewCount: 85
    },
    {
      id: 3,
      name: 'Adventure Tours',
      type: 'Tour Operator',
      contact: '+1234567892',
      latitude: 25.2050,
      longitude: 55.2710,
      id_site: 1,
      image: 'assets/images/tours.jpg',
      rating: 4.7,
      reviewCount: 65
    }
  ];

  siteId!: number;
  siteData!: Site;
  categoriesMap = new Map<number, string>();

  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.siteId = +idParam;
        this.loadSiteDetails();
      }
    });
  }

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));
    });
  }

  loadSiteDetails() {
    this.siteService.getById(this.siteId).subscribe({
      next: (site: Site) => {
        this.siteData = site;
        console.log('Fetched Site:', this.siteData);
      },
      error: (error) => {
        console.error('Error loading site details:', error);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categoriesMap.get(categoryId) || 'Unknown';
  }
}
