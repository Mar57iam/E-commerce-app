import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderResponse {
  session?: {
    url?: string;
  };
}

export interface UserOrderItem {
  _id: string;
  count: number;
  price: number;
  product: {
    title: string;
    imageCover: string;
  };
}

export interface UserOrder {
  _id: string;
  cartItems: UserOrderItem[];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly httpClient = inject(HttpClient);
  private readonly ordersUrl = `${environment.baseUrl}/api/v1/orders`;

  createCashOrder(
    cartId: string,
    shippingAddress: ShippingAddress,
  ): Observable<OrderResponse> {
    return this.httpClient.post<OrderResponse>(
      `${this.ordersUrl}/${encodeURIComponent(cartId)}`,
      { shippingAddress },
    );
  }

  createCheckoutSession(
    cartId: string,
    shippingAddress: ShippingAddress,
    returnUrl: string,
  ): Observable<OrderResponse> {
    const params = new HttpParams().set('url', returnUrl);

    return this.httpClient.post<OrderResponse>(
      `${this.ordersUrl}/checkout-session/${encodeURIComponent(cartId)}`,
      { shippingAddress },
      { params },
    );
  }

  getUserOrders(userId: string): Observable<unknown> {
    return this.httpClient.get<unknown>(
      `${this.ordersUrl}/user/${encodeURIComponent(userId)}`,
    );
  }
}
