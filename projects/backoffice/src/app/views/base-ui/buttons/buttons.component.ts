import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [UIExamplesListComponent,NgbDropdownModule],
  templateUrl: './buttons.component.html',
  styles: ``
})
export class ButtonsComponent {
  title = "Buttons"
}
