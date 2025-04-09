import { Component } from '@angular/core';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-list-group',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './list-group.component.html',
  styles: ``
})
export class ListGroupComponent {
title="List Group"
}
