import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, toArray } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CategoriesResponse,
  SubcategoriesResponse,
} from '../models/category.model';
import { SKIP_GLOBAL_LOADING } from '../interceptors/loading-interceptor';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/api/v1`;
  private readonly categoriesUrl = `${this.apiUrl}/categories`;
  private readonly subcategoriesUrl = `${this.apiUrl}/subcategories`;

  getAllCategories(): Observable<CategoriesResponse> {
    return this.httpClient.get<CategoriesResponse>(this.categoriesUrl, {
      context: this.categoryRequestContext(),
    });
  }

  getAllSubcategories(): Observable<SubcategoriesResponse> {
    return this.getSubcategoriesPage(1).pipe(
      expand((response) =>
        response.metadata.nextPage
          ? this.getSubcategoriesPage(response.metadata.nextPage)
          : EMPTY,
      ),
      toArray(),
      map((pages) => ({
        ...pages[0],
        data: pages.flatMap((page) => page.data),
      })),
    );
  }

  private categoryRequestContext(): HttpContext {
    return new HttpContext().set(SKIP_GLOBAL_LOADING, true);
  }

  private getSubcategoriesPage(page: number): Observable<SubcategoriesResponse> {
    return this.httpClient.get<SubcategoriesResponse>(
      this.subcategoriesUrl,
      {
        params: new HttpParams().set('limit', 50).set('page', page),
        context: this.categoryRequestContext(),
      },
    );
  }
}
