import { Component } from '@angular/core'
import { RecentProject } from '../../data'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'

@Component({
  selector: 'widget-recent-project',
  standalone: true,
  imports: [NgbProgressbarModule, SimplebarAngularModule],
  templateUrl: './recent-project.component.html',
  styles: ``,
})
export class RecentProjectComponent {
  projectsList = RecentProject
}
