import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperSilderComponent } from './swiper-silder.component';

describe('SwiperSilderComponent', () => {
  let component: SwiperSilderComponent;
  let fixture: ComponentFixture<SwiperSilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwiperSilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwiperSilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
