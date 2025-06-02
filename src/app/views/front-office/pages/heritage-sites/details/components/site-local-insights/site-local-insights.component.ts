import { Component, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from '../../../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { LocalInsight } from '@core/Models/localInsight';
import { LocalInsightService } from '@core/services/local-insight.service';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';
import { Lightbox, LightboxModule } from 'ngx-lightbox';
import * as bootstrap from 'bootstrap';

register();

@Component({
  selector: 'app-site-local-insights',
  templateUrl: './site-local-insights.component.html',
  styleUrls: ['./site-local-insights.component.scss'],
  standalone: true,
  imports: [CommonModule,LightboxModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SiteLocalInsightsComponent implements OnInit {
  @Input() siteId?: number;
  localInsights: LocalInsight[] = [];
  loading = true;
  error: string | null = null;
  showVideo: boolean[] = [];
  currentSpeech: SpeechSynthesisUtterance | null = null;
  currentVideoUrl: string = '';
  selectedVideoTitle: string = '';
  videoModal: any; // Bootstrap modal instance

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

  constructor(private localInsightService: LocalInsightService,
    private lightbox: Lightbox
  ) {}

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
        this.showVideo = new Array(insights.length).fill(false);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading local insights:', err);
        this.error = 'Failed to load local insights';
        this.loading = false;
      }
    });
  }

  getVideoUrl(id: number | undefined): string {
    return `${environment.apiUrl}/images/video/${id}`;
  }

  getImageUrl(): string {
    return 'assets/images/qr-code.png';
  }
  openVideoModal(insight: LocalInsight): void {
    this.currentVideoUrl = this.getVideoUrl(insight.id);
    this.selectedVideoTitle = insight.title || 'Video';
  
    const modalElement = document.getElementById('videoModal');
    if (modalElement) {
      this.videoModal = new bootstrap.Modal(modalElement);
      this.videoModal.show();
    }
  }
  openLightbox(insight: LocalInsight, index: number): void {
    const album = [{
      src: this.getVideoUrl(insight.id),
      caption: insight.title || 'Video',
      type: 'video',
      thumb: this.getImageUrl() // single string
    }];
  
    this.lightbox.open(album, 0, {
      wrapAround: true,
      videoAttributes: {
        autoplay: true,
        controls: true
      }
    });
  }

  speak(text: string | undefined): void {
    if (!text) return;
    
    // If speech is already in progress
    if (window.speechSynthesis.speaking && this.currentSpeech) {
      window.speechSynthesis.cancel();
      this.currentSpeech = null;
      return;
    }
  
    // Create new speech
    this.currentSpeech = new SpeechSynthesisUtterance(text);
    this.currentSpeech.onend = () => {
      this.currentSpeech = null;
    };
    window.speechSynthesis.speak(this.currentSpeech);
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