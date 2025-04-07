import { Component } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { alert, type AlertType } from './data';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgbAlertModule,UIExamplesListComponent],
  templateUrl: './alert.component.html',
  styles: ``
})
export class AlertComponent {
  title="Alert"
  alertData: AlertType[] = alert

  close(index: number) {
    this.alertData.splice(index, 1)
  }
}
