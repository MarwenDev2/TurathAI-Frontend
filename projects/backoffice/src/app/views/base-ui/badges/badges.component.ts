import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-badges',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './badges.component.html',
  styles: ``
})
export class BadgesComponent {
  title = "Badge"
}
