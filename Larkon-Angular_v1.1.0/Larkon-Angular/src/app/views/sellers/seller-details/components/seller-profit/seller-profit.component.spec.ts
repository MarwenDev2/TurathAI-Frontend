import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProfitComponent } from './seller-profit.component';

describe('SellerProfitComponent', () => {
  let component: SellerProfitComponent;
  let fixture: ComponentFixture<SellerProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProfitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
