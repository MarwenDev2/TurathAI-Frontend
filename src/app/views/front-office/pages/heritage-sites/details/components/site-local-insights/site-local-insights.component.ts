import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalInsight } from '@core/Models/localInsight';
import { LocalInsightService } from '@core/services/local-insight.service';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-site-local-insights',
  templateUrl: './site-local-insights.component.html',
  styleUrls: ['./site-local-insights.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteLocalInsightsComponent implements OnInit {
  @Input() siteId?: number;
  localInsights: LocalInsight[] = [];
  loading = true;
  error: string | null = null;

  swiperConfig: SwiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  };

  constructor(private localInsightService: LocalInsightService) {}

  ngOnInit(): void {
    if (this.siteId) {
      this.loadLocalInsights();
    }
  }

  loadLocalInsights(): void {
    this.loading = true;
    this.error = null;

    this.localInsightService.getLocalInsightsBySiteId(this.siteId!).subscribe({
      next: (insights: LocalInsight[]) => {
        this.localInsights = insights;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading local insights:', err);
        this.error = 'Failed to load local insights';
        this.loading = false;
      }
    });
  }

  handleLike(insight: LocalInsight): void {
    if (!insight.id) return;
    
    this.localInsightService.likeLocalInsight(insight.id).subscribe({
      next: (updatedInsight: LocalInsight) => {
        const index = this.localInsights.findIndex(i => i.id === insight.id);
        if (index !== -1) {
          this.localInsights[index] = updatedInsight;
        }
      },
      error: (err: any) => console.error('Error liking insight:', err)
    });
  }

  handleDislike(insight: LocalInsight): void {
    if (!insight.id) return;
    
    this.localInsightService.dislikeLocalInsight(insight.id).subscribe({
      next: (updatedInsight: LocalInsight) => {
        const index = this.localInsights.findIndex(i => i.id === insight.id);
        if (index !== -1) {
          this.localInsights[index] = updatedInsight;
        }
      },
      error: (err: any) => console.error('Error disliking insight:', err)
    });
  }
}
