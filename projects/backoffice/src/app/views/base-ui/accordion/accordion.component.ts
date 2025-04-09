import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [NgbAccordionModule,UIExamplesListComponent],
  templateUrl: './accordion.component.html',
  styles: ``
})
export class AccordionComponent {
  title='Accordion'
}
