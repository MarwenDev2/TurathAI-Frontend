import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPagesComponent } from './top-pages.component';

describe('TopPagesComponent', () => {
  let component: TopPagesComponent;
  let fixture: ComponentFixture<TopPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
