import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-avatars',
  standalone: true,
  imports: [UIExamplesListComponent],
  templateUrl: './avatars.component.html',
  styles: ``
})
export class AvatarsComponent {
title="Avatar"
}
