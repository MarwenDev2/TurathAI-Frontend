import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSettingComponent } from './customer-setting.component';

describe('CustomerSettingComponent', () => {
  let component: CustomerSettingComponent;
  let fixture: ComponentFixture<CustomerSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
