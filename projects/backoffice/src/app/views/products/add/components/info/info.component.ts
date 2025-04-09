import { Component } from '@angular/core';
import { SelectFormInputDirective } from 'projects/backoffice/src/app/core/directive/select-form-input.directive';

@Component({
  selector: 'add-info',
  standalone: true,
  imports: [SelectFormInputDirective],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {

}
