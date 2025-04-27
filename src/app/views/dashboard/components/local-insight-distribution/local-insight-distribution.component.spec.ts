import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalInsightDistributionComponent } from './local-insight-distribution.component';

describe('LocalInsightDistributionComponent', () => {
  let component: LocalInsightDistributionComponent;
  let fixture: ComponentFixture<LocalInsightDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalInsightDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalInsightDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
