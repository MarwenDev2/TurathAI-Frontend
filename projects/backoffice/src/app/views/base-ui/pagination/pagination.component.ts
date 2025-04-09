import { Component } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UIExamplesListComponent } from '../../../components/ui-examples-list/ui-examples-list.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgbPaginationModule,UIExamplesListComponent],
  templateUrl: './pagination.component.html',
  styles: ``
})
export class PaginationComponent {
title="pagination"
}
