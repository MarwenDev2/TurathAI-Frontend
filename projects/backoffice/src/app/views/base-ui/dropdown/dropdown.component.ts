import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [UIExamplesListComponent,NgbDropdownModule],
  templateUrl: './dropdown.component.html',
  styles: ``
})
export class DropdownComponent {
  title = "Dropdown"
}
