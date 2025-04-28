import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error404AltComponent } from './error-404-alt.component';

describe('Error404AltComponent', () => {
  let component: Error404AltComponent;
  let fixture: ComponentFixture<Error404AltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error404AltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Error404AltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
