import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { credits, currentYear } from '@common/constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterComponent {
  year = currentYear;
  credits = credits;
}
