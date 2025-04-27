import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxplotComponent } from './boxplot.component';

describe('BoxplotComponent', () => {
  let component: BoxplotComponent;
  let fixture: ComponentFixture<BoxplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxplotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
