import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDistributionComponent } from './user-distribution.component';

describe('UserDistributionComponent', () => {
  let component: UserDistributionComponent;
  let fixture: ComponentFixture<UserDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
