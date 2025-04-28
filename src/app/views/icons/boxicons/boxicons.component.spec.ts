import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxiconsComponent } from './boxicons.component';

describe('BoxiconsComponent', () => {
  let component: BoxiconsComponent;
  let fixture: ComponentFixture<BoxiconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxiconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxiconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
