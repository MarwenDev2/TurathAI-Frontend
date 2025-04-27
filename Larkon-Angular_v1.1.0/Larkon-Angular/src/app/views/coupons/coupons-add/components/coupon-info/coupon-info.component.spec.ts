import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponInfoComponent } from './coupon-info.component';

describe('CouponInfoComponent', () => {
  let component: CouponInfoComponent;
  let fixture: ComponentFixture<CouponInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
