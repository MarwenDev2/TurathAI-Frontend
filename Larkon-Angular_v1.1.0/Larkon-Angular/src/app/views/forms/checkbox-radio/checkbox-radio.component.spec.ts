import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxRadioComponent } from './checkbox-radio.component';

describe('CheckboxRadioComponent', () => {
  let component: CheckboxRadioComponent;
  let fixture: ComponentFixture<CheckboxRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxRadioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
