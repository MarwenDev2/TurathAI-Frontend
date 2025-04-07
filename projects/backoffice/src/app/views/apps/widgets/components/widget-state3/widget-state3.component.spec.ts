import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WidgetState3Component } from './widget-state3.component'

describe('WidgetState3Component', () => {
  let component: WidgetState3Component
  let fixture: ComponentFixture<WidgetState3Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetState3Component],
    }).compileComponents()

    fixture = TestBed.createComponent(WidgetState3Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
