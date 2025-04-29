import { CommonModule } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbCarouselModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'detail-product-image',
  standalone: true,
  imports: [NgbCarouselModule,CommonModule],
  templateUrl: './product-image.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductImageComponent {
  activeSlide: number = 0;
  slides = [
    { img: 'assets/images/product/p-1.png', thumb: 'assets/images/product/p-1.png' },
    { img: 'assets/images/product/p-10.png', thumb: 'assets/images/product/p-10.png' },
    { img: 'assets/images/product/p-13.png', thumb: 'assets/images/product/p-13.png' },
    { img: 'assets/images/product/p-14.png', thumb: 'assets/images/product/p-14.png' }
  ];

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 2000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit() {
  }

  onSlideChange(event: any) {
    this.activeSlide = event.current;
  }
}
