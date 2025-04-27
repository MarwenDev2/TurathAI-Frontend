import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [LogoBoxComponent,RouterLink],
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {

}
