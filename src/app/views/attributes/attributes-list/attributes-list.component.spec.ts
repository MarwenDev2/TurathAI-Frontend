import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesListComponent } from './attributes-list.component';

describe('AttributesListComponent', () => {
  let component: AttributesListComponent;
  let fixture: ComponentFixture<AttributesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttributesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
