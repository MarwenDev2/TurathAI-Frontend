// category.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:9090/api/Categories'; // update to match your backend

  constructor(private http: HttpClient) {}


  getAllCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.apiUrl}/allCat`);
    }

    getById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/get/${id}`);
      }
    
      add(Category: Category): Observable<Category> {
        return this.http.post<Category>(`${this.apiUrl}/addCategory`, Category);
      }
    
      update(Category: Category): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}/updateCategory`, Category);
      }
    
      delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
      }

      getCategoryCount(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/count`);
      }
}
