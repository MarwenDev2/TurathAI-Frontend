import { Component } from '@angular/core';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';
import { currentYear } from '../../../common/constants';


@Component({
  selector: 'app-basic',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './basic.component.html',
  styles: ``
})
export class BasicComponent {
title="Basic Tables"
currentYear = currentYear
}
