import { Component } from '@angular/core';
import { FaqData } from './data'
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [NgbAccordionModule],
  templateUrl: './faqs.component.html',
  styles: ``,
})
export class FaqsComponent {
  title = 'FAQs';
  faqList = FaqData
}
