import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PermissionStateComponent } from './components/permission-state/permission-state.component';
import { permissionData } from './data';
import { CommonModule } from '@angular/common'
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [PermissionStateComponent,CommonModule,NgbPaginationModule,NgbDropdownModule],
  templateUrl: './permissions.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PermissionsComponent {
  title = 'Permissions';
  permissionList = permissionData;
}
