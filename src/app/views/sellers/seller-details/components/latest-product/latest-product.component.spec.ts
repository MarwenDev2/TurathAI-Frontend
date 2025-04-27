import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestProductComponent } from './latest-product.component';

describe('LatestProductComponent', () => {
  let component: LatestProductComponent;
  let fixture: ComponentFixture<LatestProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
