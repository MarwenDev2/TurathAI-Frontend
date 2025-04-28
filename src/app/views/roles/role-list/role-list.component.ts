import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RoleData } from './data'
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [NgbPaginationModule,RouterLink],
  templateUrl: './role-list.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RoleListComponent {
  title = 'Roles List';
  roles = RoleData
}
