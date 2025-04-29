import { Component } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'

@Component({
  selector: 'app-input-mask',
  standalone: true,
  imports: [NgxMaskDirective],
  templateUrl: './input-mask.component.html',
  styles: ``,
  providers: [provideNgxMask()],
})
export class InputMaskComponent {
title="Input Mask"
}
