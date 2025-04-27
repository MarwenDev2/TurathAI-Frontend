import { Component } from '@angular/core';

@Component({
  selector: 'item-detail',
  standalone: true,
  imports: [],
  templateUrl: './item-detail.component.html',
  styles: [`
    .timeline {
      position: relative;
      padding: 20px 0;
    }
    
    .timeline-item {
      position: relative;
      padding-left: 50px;
      margin-bottom: 30px;
    }
    
    .timeline-point {
      position: absolute;
      left: 0;
      width: 32px;
      height: 32px;
      background-color: #f8f9fa;
      border: 2px solid #dee2e6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .timeline-point i {
      font-size: 16px;
      color: #6c757d;
    }
    
    .timeline-content {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
    }
    
    .timeline-item:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 15px;
      top: 32px;
      bottom: -30px;
      width: 2px;
      background-color: #dee2e6;
    }
  `]
})
export class ItemDetailComponent {

}
