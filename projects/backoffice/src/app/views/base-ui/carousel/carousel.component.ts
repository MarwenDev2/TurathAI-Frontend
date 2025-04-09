import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [UIExamplesListComponent, NgbCarouselModule,FormsModule],
  templateUrl: './carousel.component.html',
  styles: ``
})
export class CarouselComponent {
  title = "Carousel"



  constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true
    config.showNavigationIndicators = true
  }
}
