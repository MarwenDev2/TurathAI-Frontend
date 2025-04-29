import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FrontOfficeComponent } from './front-office.component';
import { FrontOfficeRoutingModule } from './front-office-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FrontOfficeRoutingModule
  ]
})
export class FrontOfficeModule { } 