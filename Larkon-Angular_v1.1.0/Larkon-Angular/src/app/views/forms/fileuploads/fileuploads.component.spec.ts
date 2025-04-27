import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadsComponent } from './fileuploads.component';

describe('FileuploadsComponent', () => {
  let component: FileuploadsComponent;
  let fixture: ComponentFixture<FileuploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileuploadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileuploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
