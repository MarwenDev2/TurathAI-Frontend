import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStateComponent } from './purchase-state.component';

describe('PurchaseStateComponent', () => {
  let component: PurchaseStateComponent;
  let fixture: ComponentFixture<PurchaseStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
