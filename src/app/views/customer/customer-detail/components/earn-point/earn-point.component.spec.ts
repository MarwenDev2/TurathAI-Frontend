import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarnPointComponent } from './earn-point.component';

describe('EarnPointComponent', () => {
  let component: EarnPointComponent;
  let fixture: ComponentFixture<EarnPointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarnPointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarnPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
