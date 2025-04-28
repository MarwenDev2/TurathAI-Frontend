import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WidgetFriendRequestComponent } from './widget-friend-request.component'

describe('WidgetFriendRequestComponent', () => {
  let component: WidgetFriendRequestComponent
  let fixture: ComponentFixture<WidgetFriendRequestComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetFriendRequestComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(WidgetFriendRequestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
