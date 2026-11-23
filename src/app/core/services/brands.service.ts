import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EMPTY, expand, map, Observable, toArray } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ProductBrand } from '../models/product.model';

interface BrandsResponse {
  results: number;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
  };
  data: ProductBrand[];
}

interface BrandResponse {
  data: ProductBrand;
}

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);
  private readonly brandsUrl = `${environment.baseUrl}/api/v1/brands`;

  getAllBrands(): Observable<BrandsResponse> {
    return this.getBrandsPage(1).pipe(
      expand((response) =>
        response.metadata.nextPage
          ? this.getBrandsPage(response.metadata.nextPage)
          : EMPTY,
      ),
      toArray(),
      map((pages) => ({
        ...pages[0],
        data: pages.flatMap((page) => page.data),
      })),
    );
  }

  getSpecificBrand(brandId: string): Observable<BrandResponse> {
    return this.httpClient.get<BrandResponse>(
      `${this.brandsUrl}/${encodeURIComponent(brandId)}`,
    );
  }

  private getBrandsPage(page: number): Observable<BrandsResponse> {
    return this.httpClient.get<BrandsResponse>(this.brandsUrl, {
      params: new HttpParams().set('page', page),
    });
  }
}
