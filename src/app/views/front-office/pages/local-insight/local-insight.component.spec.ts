import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalInsightComponent } from './local-insight.component';

describe('LocalInsightComponent', () => {
  let component: LocalInsightComponent;
  let fixture: ComponentFixture<LocalInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
