import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { NgbCarouselModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'
import {
  Autoplay,
  EffectCreative,
  EffectFade,
  EffectFlip,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper/modules'
import { register } from 'swiper/element'
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from "@/app/core/directive/swiper-directive.component";
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { Site } from '@core/Models/site';

register()
@Component({
  selector: 'detail-site-image',
  standalone: true,
  imports: [NgbCarouselModule, CommonModule, SwiperDirective, UIExamplesListComponent],
  templateUrl: './site-image.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [`
    swiper-container {
      width: 100%;
      height: 588px; /* Desired height */
      display: block;
    }

  
    swiper-slide img {
      height: 100%;
      width: 100%;
      object-fit: cover; /* Fill container without distortion */
    }
  `]
  
})

export class SiteImageComponent {
  @Input() site!: Site;

  getImageUrls(imageIds: number[] | undefined): string[] {
    if (!imageIds || imageIds.length === 0) {
      return ['assets/images/qr-code.png'];
    }
    return imageIds.map(id => `http://localhost:9090/images/${id}`);
  }

  swiperConfig: SwiperOptions = {
    modules: [Autoplay],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  }

  swiperNavigation: SwiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: '.basic-pagination',
    },
    navigation: {
      nextEl: '.basic-next',
      prevEl: '.basic-prev',
    },
  }

  swiperPagination: SwiperOptions = {
    modules: [Autoplay, Pagination],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: '.dynamic-pagination',
      dynamicBullets: true,
    },
  }

  swiperfadeEffect: SwiperOptions = {
    modules: [Pagination, Autoplay, EffectFade],
    loop: true,
    effect: 'fade',
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
      el: '.effect-pagination',
    },
  }

  swiperCreativeEffect: SwiperOptions = {
    modules: [Autoplay, Pagination, EffectCreative],
    loop: true,
    grabCursor: true,
    effect: 'creative',
    creativeEffect: {
      prev: {
        shadow: true,
        translate: [0, 0, -400],
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.creative-pagination',
      clickable: true,
    },
  }

  swiperFlip: SwiperOptions = {
    modules: [EffectFlip, Pagination],
    loop: true,
    effect: 'flip',
    grabCursor: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-flip',
      clickable: true,
    },
  }

  swiperScroll: SwiperOptions = {
    modules: [Autoplay, Scrollbar, Navigation],
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      hide: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  }

  verticalConfig: SwiperOptions = {
    modules: [Autoplay, Pagination],
    loop: true,
    direction: 'vertical',
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.vertical-pagination',
      clickable: true,
    },
  }

  swiperMouseWheel: SwiperOptions = {
    modules: [Autoplay, Pagination, Mousewheel],
    loop: true,
    direction: 'vertical',
    mousewheel: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.mouse-wheel-pagination',
      clickable: true,
    },
  }

  resposiveConfig: SwiperOptions = {
    modules: [Pagination],
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: '.responsive-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  }
}
