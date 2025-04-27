import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherSettingComponent } from './voucher-setting.component';

describe('VoucherSettingComponent', () => {
  let component: VoucherSettingComponent;
  let fixture: ComponentFixture<VoucherSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
