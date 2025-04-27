import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core'
import type { SwiperOptions } from 'swiper/types'

@Directive({
  selector: 'swiper-container',
  standalone: true,
})
export class SwiperDirective implements AfterViewInit {
  private readonly swiperElement: HTMLElement

  @Input('config') config?: SwiperOptions

  constructor(
    private el: ElementRef<HTMLElement & { initialize: () => void }>
  ) {
    this.swiperElement = el.nativeElement
  }

  ngAfterViewInit() {
    Object.assign(this.el.nativeElement, this.config)

    this.el.nativeElement.initialize()
  }
}
