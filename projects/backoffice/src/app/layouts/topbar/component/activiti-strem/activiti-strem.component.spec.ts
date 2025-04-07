import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiStremComponent } from './activiti-strem.component';

describe('ActivitiStremComponent', () => {
  let component: ActivitiStremComponent;
  let fixture: ComponentFixture<ActivitiStremComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivitiStremComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiStremComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
