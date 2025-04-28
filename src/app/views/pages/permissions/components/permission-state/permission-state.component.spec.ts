import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionStateComponent } from './permission-state.component';

describe('PermissionStateComponent', () => {
  let component: PermissionStateComponent;
  let fixture: ComponentFixture<PermissionStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
