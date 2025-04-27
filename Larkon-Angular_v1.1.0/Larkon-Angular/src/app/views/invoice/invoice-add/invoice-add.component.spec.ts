import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceAddComponent } from './invoice-add.component';

describe('InvoiceAddComponent', () => {
  let component: InvoiceAddComponent;
  let fixture: ComponentFixture<InvoiceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
