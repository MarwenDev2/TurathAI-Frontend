import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDetailComponent } from './seller-detail.component';

describe('SellerDetailComponent', () => {
  let component: SellerDetailComponent;
  let fixture: ComponentFixture<SellerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
