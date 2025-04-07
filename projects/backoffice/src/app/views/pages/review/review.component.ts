import { Component } from '@angular/core';
import { ReviewData } from './data';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [NgbRatingModule],
  templateUrl: './review.component.html',
  styles: ``,
})
export class ReviewComponent {
  title = 'Reviews List';
  reviewList = ReviewData;
}
