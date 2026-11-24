import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { UserOrder } from '../core/services/orders.service';
import { OrdersService } from '../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly orders = signal<UserOrder[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadOrders();
    }
  }

  protected loadOrders(): void {
    const userId = this.getStoredUserId();
    if (!userId) {
      this.isLoading.set(false);
      this.hasError.set(true);
      console.error('Unable to load orders because the stored user ID is missing or invalid.');
      return;
    }

    this.isLoading.set(true);
    this.hasError.set(false);

    this.ordersService
      .getUserOrders(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const orders = this.extractOrders(response);
          if (!orders) {
            console.error('The user-orders API returned an unsupported response shape.');
            this.hasError.set(true);
            this.isLoading.set(false);
            return;
          }

          this.orders.set(orders);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          console.error('Failed to load user orders.', error);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  private getStoredUserId(): string | null {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: unknown = JSON.parse(storedUser);
        const userId = this.readId(user);
        if (userId) {
          return userId;
        }
      } catch (error: unknown) {
        console.error('Failed to parse stored user information.', error);
      }
    }

    return this.getUserIdFromToken();
  }

  private getUserIdFromToken(): string | null {
    const tokenPayload = localStorage.getItem('token')?.split('.')[1];
    if (!tokenPayload) {
      return null;
    }

    try {
      const base64 = tokenPayload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const binaryPayload = atob(paddedBase64);
      const payloadBytes = Uint8Array.from(binaryPayload, (character) =>
        character.charCodeAt(0),
      );
      const payload: unknown = JSON.parse(new TextDecoder().decode(payloadBytes));
      return this.readId(payload);
    } catch (error: unknown) {
      console.error('Failed to read the user ID from the stored token.', error);
      return null;
    }
  }

  private extractOrders(response: unknown): UserOrder[] | null {
    const directOrders = this.toUserOrders(response);
    if (directOrders) {
      return directOrders;
    }

    if (!this.isRecord(response)) {
      return null;
    }

    const dataOrders = this.toUserOrders(response['data']);
    if (dataOrders) {
      return dataOrders;
    }

    const topLevelOrders = this.toUserOrders(response['orders']);
    if (topLevelOrders) {
      return topLevelOrders;
    }

    const data = response['data'];
    if (this.isRecord(data)) {
      const nestedDataOrders = this.toUserOrders(data['data']);
      if (nestedDataOrders) {
        return nestedDataOrders;
      }

      const nestedOrders = this.toUserOrders(data['orders']);
      if (nestedOrders) {
        return nestedOrders;
      }
    }

    return null;
  }

  private toUserOrders(value: unknown): UserOrder[] | null {
    if (!Array.isArray(value)) {
      return null;
    }

    const orders = value.filter((order) => this.isUserOrder(order));
    return orders.length === value.length ? orders : null;
  }

  private isUserOrder(value: unknown): value is UserOrder {
    if (!this.isRecord(value)) {
      return false;
    }

    const cartItems = value['cartItems'];
    return (
      typeof value['_id'] === 'string' &&
      Array.isArray(cartItems) &&
      cartItems.every((item) => this.isUserOrderItem(item)) &&
      typeof value['totalOrderPrice'] === 'number' &&
      typeof value['paymentMethodType'] === 'string' &&
      typeof value['isPaid'] === 'boolean' &&
      typeof value['isDelivered'] === 'boolean' &&
      typeof value['createdAt'] === 'string'
    );
  }

  private isUserOrderItem(value: unknown): boolean {
    if (!this.isRecord(value)) {
      return false;
    }

    const product = value['product'];
    return (
      typeof value['_id'] === 'string' &&
      typeof value['count'] === 'number' &&
      typeof value['price'] === 'number' &&
      this.isRecord(product) &&
      typeof product['title'] === 'string' &&
      typeof product['imageCover'] === 'string'
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private readId(value: unknown): string | null {
    if (typeof value !== 'object' || value === null) {
      return null;
    }

    if ('_id' in value && typeof value._id === 'string') {
      return value._id;
    }

    if ('id' in value && typeof value.id === 'string') {
      return value.id;
    }

    return null;
  }
}
