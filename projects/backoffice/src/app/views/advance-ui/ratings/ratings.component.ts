import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [NgbRatingModule,ReactiveFormsModule, UIExamplesListComponent],
  templateUrl: './ratings.component.html',
  styles: ``
})
export class RatingsComponent {
  title = "Ratings"
  basicRating = 5
  rating = 3
  stepRating = 0
  readonly=3.5
  hovered = 0
  hoverSelected = 1
  
  ctrl = new FormControl<number | null>(null, Validators.required)
}
