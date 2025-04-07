import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReviewData } from '../../data'

@Component({
  selector: 'profile-reviews',
  standalone: true,
  imports: [],
  templateUrl: './reviews.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReviewsComponent {
  reviewList = ReviewData
}
