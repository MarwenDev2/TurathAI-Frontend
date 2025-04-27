import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProgressComponent } from './order-progress.component';

describe('OrderProgressComponent', () => {
  let component: OrderProgressComponent;
  let fixture: ComponentFixture<OrderProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
