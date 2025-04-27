import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsCountryComponent } from './sessions-country.component';

describe('SessionsCountryComponent', () => {
  let component: SessionsCountryComponent;
  let fixture: ComponentFixture<SessionsCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsCountryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
