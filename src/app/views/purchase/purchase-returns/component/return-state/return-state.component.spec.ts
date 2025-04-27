import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnStateComponent } from './return-state.component';

describe('ReturnStateComponent', () => {
  let component: ReturnStateComponent;
  let fixture: ComponentFixture<ReturnStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
