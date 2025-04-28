import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGrowthComponent } from './user-growth.component';

describe('UserGrowthComponent', () => {
  let component: UserGrowthComponent;
  let fixture: ComponentFixture<UserGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGrowthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
