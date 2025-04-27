import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesEditComponent } from './attributes-edit.component';

describe('AttributesEditComponent', () => {
  let component: AttributesEditComponent;
  let fixture: ComponentFixture<AttributesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
