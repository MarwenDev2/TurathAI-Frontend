import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductInfoComponent } from './seller-product-info.component';

describe('SellerProductInfoComponent', () => {
  let component: SellerProductInfoComponent;
  let fixture: ComponentFixture<SellerProductInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
