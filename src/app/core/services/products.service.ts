import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SKIP_GLOBAL_LOADING } from '../interceptors/loading-interceptor';
import {
  ProductResponse,
  ProductsResponse,
} from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);
  private readonly productsUrl = `${environment.baseUrl}/api/v1/products`;

  getAllProducts(): Observable<ProductsResponse> {
    return this.httpClient.get<ProductsResponse>(this.productsUrl, {
      context: new HttpContext().set(SKIP_GLOBAL_LOADING, true),
    });
  }

  getSpecificProduct(productId: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(
      `${this.productsUrl}/${encodeURIComponent(productId)}`,
    );
  }
}
