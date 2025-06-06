import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchivementComponent } from './achivement.component';

describe('AchivementComponent', () => {
  let component: AchivementComponent;
  let fixture: ComponentFixture<AchivementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchivementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchivementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
