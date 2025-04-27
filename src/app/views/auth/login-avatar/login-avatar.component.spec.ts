import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAvatarComponent } from './login-avatar.component';

describe('LoginAvatarComponent', () => {
  let component: LoginAvatarComponent;
  let fixture: ComponentFixture<LoginAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
