import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEditComponent } from './seller-edit.component';

describe('SellerEditComponent', () => {
  let component: SellerEditComponent;
  let fixture: ComponentFixture<SellerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
