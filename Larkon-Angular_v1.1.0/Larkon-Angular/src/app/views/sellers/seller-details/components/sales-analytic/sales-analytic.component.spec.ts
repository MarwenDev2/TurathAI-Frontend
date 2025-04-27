import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAnalyticComponent } from './sales-analytic.component';

describe('SalesAnalyticComponent', () => {
  let component: SalesAnalyticComponent;
  let fixture: ComponentFixture<SalesAnalyticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesAnalyticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAnalyticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
