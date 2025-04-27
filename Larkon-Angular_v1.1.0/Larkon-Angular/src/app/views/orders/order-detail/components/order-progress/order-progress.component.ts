import { Component } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'order-progress',
  standalone: true,
  imports: [NgbProgressbarModule],
  templateUrl: './order-progress.component.html',
  styles: ``,
})
export class OrderProgressComponent {}
