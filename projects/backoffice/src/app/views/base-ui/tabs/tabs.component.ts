import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [UIExamplesListComponent,NgbNavModule],
  templateUrl: './tabs.component.html',
  styles: ``
})
export class TabsComponent {
  title = "Tabs"
}
