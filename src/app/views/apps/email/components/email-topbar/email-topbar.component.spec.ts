import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EmailTopbarComponent } from './email-topbar.component'

describe('EmailTopbarComponent', () => {
  let component: EmailTopbarComponent
  let fixture: ComponentFixture<EmailTopbarComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailTopbarComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EmailTopbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
