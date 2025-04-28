import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerStateComponent } from './customer-state.component';

describe('CustomerStateComponent', () => {
  let component: CustomerStateComponent;
  let fixture: ComponentFixture<CustomerStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
