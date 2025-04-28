import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecoutModalComponent } from './checout-modal.component';

describe('ChecoutModalComponent', () => {
  let component: ChecoutModalComponent;
  let fixture: ComponentFixture<ChecoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecoutModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
