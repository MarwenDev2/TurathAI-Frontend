import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalDetailComponent } from './personal-detail.component';

describe('PersonalDetailComponent', () => {
  let component: PersonalDetailComponent;
  let fixture: ComponentFixture<PersonalDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
