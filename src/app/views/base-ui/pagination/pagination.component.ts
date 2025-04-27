import { Component } from '@angular/core';
import { UIExamplesListComponent } from '@component/ui-examples-list/ui-examples-list.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

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
