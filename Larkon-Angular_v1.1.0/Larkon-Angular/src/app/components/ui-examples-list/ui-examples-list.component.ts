import { AfterViewInit, Component, Input } from '@angular/core'
import Gumshoe from 'gumshoejs'

@Component({
  selector: 'ui-examples-list',
  standalone: true,
  templateUrl: './ui-examples-list.component.html',
})
export class UIExamplesListComponent implements AfterViewInit {
  @Input() linkList: { label: string; link: string }[] | undefined

  ngAfterViewInit() {
    if (document.querySelector('.docs-nav a')) new Gumshoe('.docs-nav a')
  }

  scrollToSection(event: Event, link: string) {
    event.preventDefault()
    const targetId = link.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
