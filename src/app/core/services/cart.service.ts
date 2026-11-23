import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AddToCartResponse,
  CartActionResponse,
  GetCartResponse,
} from '../../cart/models/cart.interface';
import { SKIP_GLOBAL_LOADING } from '../interceptors/loading-interceptor';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly cartUrl = `${environment.baseUrl}/api/v2/cart`;

  readonly itemCount = signal(0);

  addProduct(productId: string): Observable<AddToCartResponse> {
    return this.httpClient
      .post<AddToCartResponse>(this.cartUrl, { productId })
      .pipe(
        tap((response) => {
          if (typeof response.numOfCartItems === 'number') {
            this.itemCount.set(response.numOfCartItems);
          }
        }),
      );
  }

  getCart(): Observable<GetCartResponse> {
    return this.httpClient.get<GetCartResponse>(this.cartUrl, {
      context: this.cartRequestContext(),
    }).pipe(tap((response) => this.itemCount.set(response.numOfCartItems)));
  }

  resetItemCount(): void {
    this.itemCount.set(0);
  }

  updateProductQuantity(
    productId: string,
    count: number,
  ): Observable<CartActionResponse> {
    return this.httpClient.put<CartActionResponse>(
      `${this.cartUrl}/${encodeURIComponent(productId)}`,
      { count },
      { context: this.cartRequestContext() },
    );
  }

  removeProduct(productId: string): Observable<CartActionResponse> {
    return this.httpClient.delete<CartActionResponse>(
      `${this.cartUrl}/${encodeURIComponent(productId)}`,
      { context: this.cartRequestContext() },
    );
  }

  clearCart(): Observable<CartActionResponse> {
    return this.httpClient.delete<CartActionResponse>(this.cartUrl, {
      context: this.cartRequestContext(),
    });
  }

  private cartRequestContext(): HttpContext {
    return new HttpContext().set(SKIP_GLOBAL_LOADING, true);
  }
}
