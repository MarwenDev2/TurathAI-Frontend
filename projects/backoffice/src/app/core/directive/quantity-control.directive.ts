import { Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appQuantityControl]',
  standalone:true
})
export class QuantityControlDirective implements AfterViewInit {
  @Input() quantity: number = 0;
  @Output() quantityChange = new EventEmitter<number>();

  private inputElement!: HTMLInputElement;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const children = this.el.nativeElement.children;
    this.inputElement = children[1] as HTMLInputElement;
    this.updateInputValue(this.quantity);
  }

  @HostListener('click', ['$event.target']) onClick(btn: HTMLElement) {
    if (btn.classList.contains('plus')) {
      this.increment();
    } else if (btn.classList.contains('minus')) {
      this.decrement();
    }
  }

  private increment() {
    let currentValue = parseInt(this.inputElement.value, 10);
    if (currentValue < 100) {
      currentValue++;
      this.updateValue(currentValue);
    }
  }

  private decrement() {
    let currentValue = parseInt(this.inputElement.value, 10);
    if (currentValue > 1) {
      currentValue--;
      this.updateValue(currentValue);
    }
  }

  private updateValue(value: number) {
    this.updateInputValue(value);
    this.quantity = value;
    this.quantityChange.emit(this.quantity);
  }

  private updateInputValue(value: number) {
    this.renderer.setProperty(this.inputElement, 'value', value.toString());
  }
}
