import { ComponentFixture, TestBed } from '@angular/core/testing'
import { UIExamplesListComponent } from './ui-examples-list.component'

describe('UIExamplesListComponent', () => {
  let component: UIExamplesListComponent
  let fixture: ComponentFixture<UIExamplesListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIExamplesListComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(UIExamplesListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
