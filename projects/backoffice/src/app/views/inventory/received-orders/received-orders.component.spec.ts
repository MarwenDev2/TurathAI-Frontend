import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedOrdersComponent } from './received-orders.component';

describe('ReceivedOrdersComponent', () => {
  let component: ReceivedOrdersComponent;
  let fixture: ComponentFixture<ReceivedOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
