import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [NgbNavModule],
  templateUrl: './wizard.component.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WizardComponent {
  title = "Wizard"
  active = 1
  activeId = 1
}
