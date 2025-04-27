import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'detail-top-review',
  standalone: true,
  imports: [NgbRatingModule],
  templateUrl: './top-review.component.html',
  styles: ``
})
export class TopReviewComponent {
  constructor(private modalService: NgbModal) {}

  openReviewModal() {
    // TODO: Implement the review modal opening logic
    console.log('Opening review modal...');
  }
}
