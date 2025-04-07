import { Directive, ElementRef, Input, OnInit } from '@angular/core'
import flatpickr from 'flatpickr'
import { Options } from 'flatpickr/dist/types/options'

@Directive({
  selector: '[mwlFlatpickr]',
  standalone: true,
})
export class FlatpickrDirective implements OnInit {
  @Input() flatpickrOptions: Options = {}

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.initFlatpickr()
  }

  private initFlatpickr() {
    flatpickr(this.el.nativeElement, this.flatpickrOptions)
  }
}
