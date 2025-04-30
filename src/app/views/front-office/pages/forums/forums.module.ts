import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FORUMS_ROUTES } from './forums.routes';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(FORUMS_ROUTES)
  ]
})
export class FrontOfficeForumsModule { }
