import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDetailComponent } from './shipping-detail.component';

describe('ShippingDetailComponent', () => {
  let component: ShippingDetailComponent;
  let fixture: ComponentFixture<ShippingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
