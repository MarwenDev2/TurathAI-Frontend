import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WidgetState2Component } from './widget-state2.component'

describe('WidgetState2Component', () => {
  let component: WidgetState2Component
  let fixture: ComponentFixture<WidgetState2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetState2Component],
    }).compileComponents()

    fixture = TestBed.createComponent(WidgetState2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
