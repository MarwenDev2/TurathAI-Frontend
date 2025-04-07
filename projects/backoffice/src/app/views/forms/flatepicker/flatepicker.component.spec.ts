import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatepickerComponent } from './flatepicker.component';

describe('FlatepickerComponent', () => {
  let component: FlatepickerComponent;
  let fixture: ComponentFixture<FlatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlatepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
