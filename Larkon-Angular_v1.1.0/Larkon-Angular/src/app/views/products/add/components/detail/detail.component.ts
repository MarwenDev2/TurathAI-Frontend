import { Component } from '@angular/core';
import { currency } from '@common/constants';

@Component({
  selector: 'add-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  currency=currency
}
