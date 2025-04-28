import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizationSettingComponent } from './localization-setting.component';

describe('LocalizationSettingComponent', () => {
  let component: LocalizationSettingComponent;
  let fixture: ComponentFixture<LocalizationSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalizationSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalizationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
