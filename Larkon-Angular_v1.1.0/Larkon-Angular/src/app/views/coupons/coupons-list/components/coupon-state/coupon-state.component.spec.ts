import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponStateComponent } from './coupon-state.component';

describe('CouponStateComponent', () => {
  let component: CouponStateComponent;
  let fixture: ComponentFixture<CouponStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
