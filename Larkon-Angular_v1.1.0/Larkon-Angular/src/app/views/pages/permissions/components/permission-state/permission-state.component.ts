import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { permissionState } from '../../data'
import { StateCardComponent } from '@component/state-card/state-card.component'

@Component({
  selector: 'permission-state',
  standalone: true,
  imports: [StateCardComponent],
  templateUrl: './permission-state.component.html',
})
export class PermissionStateComponent {
  stateList = permissionState
}
