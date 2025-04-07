import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesAddComponent } from './attributes-add.component';

describe('AttributesAddComponent', () => {
  let component: AttributesAddComponent;
  let fixture: ComponentFixture<AttributesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
