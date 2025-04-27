import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category } from '@core/Models/category';
import { CategoryService } from '@core/services/category.service';
import { Site } from '@core/Models/site';
import { SiteService } from '@core/services/site.service';

@Component({
  selector: 'add-info',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent {
  /*
  @Output() siteSubmit = new EventEmitter<Partial<any>>();
  siteForm: FormGroup;
  categories: Category[] = [];

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      location: ['', Validators.required],
      historicalSignificance: [''],
      popularityScore: [0, [Validators.min(0), Validators.max(100)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(data => this.categories = data);
  }

  onSubmit() {
    if (this.siteForm.valid) {
      this.siteSubmit.emit(this.siteForm.value);
    }
  }
    */
}
