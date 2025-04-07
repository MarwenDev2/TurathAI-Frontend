import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopReviewComponent } from './top-review.component';

describe('TopReviewComponent', () => {
  let component: TopReviewComponent;
  let fixture: ComponentFixture<TopReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
