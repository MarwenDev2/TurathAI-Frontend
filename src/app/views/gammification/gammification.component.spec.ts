import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GammificationComponent } from './gammification.component';

describe('GammificationComponent', () => {
  let component: GammificationComponent;
  let fixture: ComponentFixture<GammificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GammificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GammificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
