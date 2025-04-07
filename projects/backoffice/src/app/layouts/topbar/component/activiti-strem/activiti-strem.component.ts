import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { activityStreamData } from '@layouts/topbar/data';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';

@Component({
  selector: 'app-activiti-strem',
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule],
  templateUrl: './activiti-strem.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ActivitiStremComponent {
  activeOffcanvas = inject(NgbActiveOffcanvas);

  activityList = activityStreamData;

  getFileExtensionIcon(file: any) {
    const dotIndex = file.lastIndexOf('.');
    const extension = file.slice(dotIndex + 1);
    if (extension == 'docs') {
      return 'bxs-file-doc';
    } else if (extension == 'zip') {
      return 'bxs-file-archive';
    } else {
      return 'bxl-figma ';
    }
  }

  getActivityIcon(type: string) {
    if (type == 'task') {
      return 'iconamoon:folder-check-duotone';
    } else if (type == 'design') {
      return 'iconamoon:check-circle-1-duotone';
    } else {
      return 'iconamoon:certificate-badge-duotone';
    }
  }
}
