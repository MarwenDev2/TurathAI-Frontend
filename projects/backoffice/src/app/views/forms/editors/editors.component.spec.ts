import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsComponent } from './editors.component';

describe('EditorsComponent', () => {
  let component: EditorsComponent;
  let fixture: ComponentFixture<EditorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
