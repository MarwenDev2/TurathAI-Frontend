import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';

register();

interface Business {
  id: number;
  name: string;
  type: string;
  contact: string;
  latitude: number;
  longitude: number;
  id_site: number;
}

@Component({
  selector: 'related-business',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="related-businesses">
      <h3>Related Businesses</h3>
      <div class="swiper-container">
        <swiper-container [config]="swiperConfig" init="false">
          <swiper-slide *ngFor="let business of businesses">
            <div class="business-card">
              <div class="business-info">
                <h4>{{ business.name }}</h4>
                <div class="business-details">
                  <div class="detail-item">
                    <i class="bx bx-category"></i>
                    <span>Type: {{ business.type }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bx bx-phone"></i>
                    <span>Contact: {{ business.contact }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="bx bx-map"></i>
                    <span>Location: {{ business.latitude }}, {{ business.longitude }}</span>
                  </div>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-pagination"></div>
      </div>
    </div>
  `,
  styles: [`
    .related-businesses {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      margin: 20px 0;
      position: relative;
    }
    h3 {
      margin-bottom: 20px;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .swiper-container {
      position: relative;
      padding: 0 40px;
    }
    .business-card {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin: 10px;
      padding: 20px;
    }
    .business-info {
      padding: 15px;
    }
    h4 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .business-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #666;
    }
    .detail-item i {
      font-size: 1.2rem;
      color: #333;
    }
    .swiper-button-next,
    .swiper-button-prev {
      color: #333;
      background: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .swiper-button-next:after,
    .swiper-button-prev:after {
      font-size: 20px;
    }
    .swiper-pagination {
      position: relative;
      margin-top: 20px;
    }
    .swiper-pagination-bullet {
      background: #333;
      opacity: 0.5;
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
    }
  `]
})
export class RelatedBusinessComponent {
  @Input() businesses: Business[] = [];

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: true,
    pagination: { clickable: true },
    loop: true
  };
} 