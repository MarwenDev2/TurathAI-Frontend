import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaOptionComponent } from './meta-option.component';

describe('MetaOptionComponent', () => {
  let component: MetaOptionComponent;
  let fixture: ComponentFixture<MetaOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetaOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetaOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
