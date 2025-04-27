import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { LogoBoxComponent } from '@component/logo-box.component'

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [RouterLink,LogoBoxComponent],
  templateUrl: './error-404.component.html',
  styles: ``
})
export class Error404Component {

}
