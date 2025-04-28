import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySettingComponent } from './category-setting.component';

describe('CategorySettingComponent', () => {
  let component: CategorySettingComponent;
  let fixture: ComponentFixture<CategorySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
