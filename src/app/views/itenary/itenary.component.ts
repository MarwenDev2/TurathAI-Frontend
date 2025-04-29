import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ITENARY_ROUTES } from './itenary.route';

@Component({
  selector: 'app-itenary',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './itenary.component.html'
})
export class ItenaryComponent {
  // This is a container component for the itenary feature
  // It just needs to render the router-outlet for child routes
}
