import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSettingComponent } from './review-setting.component';

describe('ReviewSettingComponent', () => {
  let component: ReviewSettingComponent;
  let fixture: ComponentFixture<ReviewSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
