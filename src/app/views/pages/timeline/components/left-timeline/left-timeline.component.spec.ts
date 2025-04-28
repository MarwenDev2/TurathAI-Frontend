import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LeftTimelineComponent } from './left-timeline.component'

describe('LeftTimelineComponent', () => {
  let component: LeftTimelineComponent
  let fixture: ComponentFixture<LeftTimelineComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftTimelineComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LeftTimelineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
