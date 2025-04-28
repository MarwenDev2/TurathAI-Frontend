import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-front-office',
  template: '<router-outlet></router-outlet>',
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class FrontOfficeComponent { } 