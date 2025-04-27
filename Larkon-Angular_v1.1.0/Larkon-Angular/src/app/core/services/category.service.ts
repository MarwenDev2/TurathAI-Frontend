// category.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:9090/Categories'; // update to match your backend

  constructor(private http: HttpClient) {}


  getAllCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.apiUrl}/allCat`);
    }
}
