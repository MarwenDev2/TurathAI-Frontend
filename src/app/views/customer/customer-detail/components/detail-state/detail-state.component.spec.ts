import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailStateComponent } from './detail-state.component';

describe('DetailStateComponent', () => {
  let component: DetailStateComponent;
  let fixture: ComponentFixture<DetailStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
