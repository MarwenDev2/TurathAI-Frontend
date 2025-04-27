import { Component } from '@angular/core';
import { currency } from '@common/constants';
import { QuantityControlDirective } from '@core/directive/quantity-control.directive'
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { CommonModule } from '@angular/common';
import { Site } from '@core/Models/site';
import { Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '@core/services/site.service';
import { CategoryService } from '@core/services/category.service';


@Component({
  selector: 'site-info-detail',
  standalone: true,
  imports: [QuantityControlDirective,NgbRatingModule, CommonModule],
  templateUrl: './site-info.component.html',
  styles: [`
    .filled {
      position: absolute;
      left: 0;
      overflow: hidden;
    }
  `]
})
export class SiteInfoComponent {
  currency=currency
  @Input() site!: Site;

  get rating(): number {
    return this.site?.averageRating ?? 0;
  }

  categoriesMap = new Map<number, string>();

  ngOnInit(): void {
    this.loadData();
  }
  constructor(
    private route: ActivatedRoute,
    private siteService: SiteService,
    private categoryService: CategoryService
  ) {}

  loadData(): void {
    this.categoryService.getAllCategories().subscribe((categories) => {
      categories.forEach((cat) => this.categoriesMap.set(cat.id, cat.name));}

    )};
  

  getCategoryName(categoryId: number): string {
  return this.categoriesMap.get(categoryId) || 'Unknown';
}

  getPopularityClass(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'badge bg-primary';
      case 'Medium':
        return 'badge bg-warning';
      case 'Low':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getPopularityIcon(popularity: string): string {
    switch (popularity) {
      case 'High':
        return 'bx bx-trending-up';
      case 'Medium':
        return 'bx bx-trending-flat';
      case 'Low':
        return 'bx bx-trending-down';
      default:
        return 'bx bx-question-mark';
    }
  }
}
