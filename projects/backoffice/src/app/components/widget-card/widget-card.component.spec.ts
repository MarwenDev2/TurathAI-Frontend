import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCardComponent } from './widget-card.component';

describe('WidgetCardComponent', () => {
  let component: WidgetCardComponent;
  let fixture: ComponentFixture<WidgetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
