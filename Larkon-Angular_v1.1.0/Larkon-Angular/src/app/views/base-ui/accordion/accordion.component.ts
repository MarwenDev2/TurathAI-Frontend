import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

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
