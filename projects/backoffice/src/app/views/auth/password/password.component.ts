import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [RouterLink,LogoBoxComponent],
  templateUrl: './password.component.html',
  styles: ``
})
export class PasswordComponent {

}
