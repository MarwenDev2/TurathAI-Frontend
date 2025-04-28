import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetStateComponent } from './widget-state.component';

describe('WidgetStateComponent', () => {
  let component: WidgetStateComponent;
  let fixture: ComponentFixture<WidgetStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
