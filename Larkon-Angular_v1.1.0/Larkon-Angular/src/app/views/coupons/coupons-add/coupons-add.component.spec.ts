import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponsAddComponent } from './coupons-add.component';

describe('CouponsAddComponent', () => {
  let component: CouponsAddComponent;
  let fixture: ComponentFixture<CouponsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouponsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
