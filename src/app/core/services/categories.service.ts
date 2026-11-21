import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoriesResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly categoriesUrl = `${environment.baseUrl}/api/v1/categories`;

  getAllCategories(): Observable<CategoriesResponse> {
    return this.httpClient.get<CategoriesResponse>(this.categoriesUrl);
  }
}
