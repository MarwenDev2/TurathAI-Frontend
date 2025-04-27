import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

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
