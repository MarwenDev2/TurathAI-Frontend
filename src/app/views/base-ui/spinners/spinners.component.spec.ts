import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnersComponent } from './spinners.component';

describe('SpinnersComponent', () => {
  let component: SpinnersComponent;
  let fixture: ComponentFixture<SpinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
