import { Component } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-collapse',
  standalone: true,
  imports: [UIExamplesListComponent,NgbCollapseModule],
  templateUrl: './collapse.component.html',
  styles: ``
})
export class CollapseComponent {
  title = "Collapse"
  isCollapsed = true
  isHorizontal = true
  isFirstToggle = true
  isSecondToggle = true
}
