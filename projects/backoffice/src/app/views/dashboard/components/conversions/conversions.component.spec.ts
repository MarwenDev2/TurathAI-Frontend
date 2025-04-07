import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionsComponent } from './conversions.component';

describe('ConversionsComponent', () => {
  let component: ConversionsComponent;
  let fixture: ComponentFixture<ConversionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
