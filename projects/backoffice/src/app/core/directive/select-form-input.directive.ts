import { Directive, ElementRef, Input, type OnInit } from '@angular/core'
import Choices, { Options as ChoiceOption } from 'choices.js'

export type SelectOptions = Partial<ChoiceOption>

@Directive({
  selector: '[selectFormInput]',
  standalone: true,
})
export class SelectFormInputDirective implements OnInit {
  @Input() className?: string
  @Input() onChange?: (text: string) => void
  @Input() options?: SelectOptions

  constructor(private eleRef: ElementRef) {}

  ngOnInit(): void {
    const choices = new Choices(this.eleRef.nativeElement, {
      ...this.options,
      placeholder: true,
      allowHTML: true,
      shouldSort: false,
    })

    choices.passedElement.element.addEventListener('change', (e: Event) => {
      if (!(e.target instanceof HTMLSelectElement)) return
      if (this.onChange) {
        this.onChange(e.target.value)
      }
    })
  }
}
