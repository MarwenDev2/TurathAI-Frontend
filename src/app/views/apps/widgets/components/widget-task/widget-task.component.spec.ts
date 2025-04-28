import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WidgetTaskComponent } from './widget-task.component'

describe('WidgetTaskComponent', () => {
  let component: WidgetTaskComponent
  let fixture: ComponentFixture<WidgetTaskComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTaskComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WidgetTaskComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
