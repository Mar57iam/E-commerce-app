import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize, switchMap, tap } from 'rxjs';
import type { Observable } from 'rxjs';
import type { CartActionResponse, CartItem, UserCart } from './models/cart.interface';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly cart = signal<UserCart | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly pendingAction = signal<string | null>(null);
  protected readonly itemCount = computed(
    () => this.cart()?.products.reduce((count, item) => count + item.count, 0) ?? 0,
  );
  protected readonly subtotal = computed(
    () => this.cart()?.totalCartPrice ?? 0,
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCart();
    }
  }

  protected loadCart(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.cartService
      .getCart()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => this.cart.set(response.data),
        error: (error: unknown) => {
          console.error('Failed to load cart.', error);
          this.hasError.set(true);
        },
      });
  }

  protected updateQuantity(item: CartItem, change: number): void {
    const newCount = item.count + change;
    if (newCount < 1 || this.pendingAction()) {
      return;
    }

    this.runCartAction(
      `${item.product._id}:quantity:${change}`,
      this.cartService.updateProductQuantity(item.product._id, newCount),
      'update quantity',
    );
  }

  protected removeItem(item: CartItem): void {
    if (this.pendingAction()) {
      return;
    }

    this.runCartAction(
      `${item.product._id}:remove`,
      this.cartService.removeProduct(item.product._id),
      'remove product',
    );
  }

  protected clearCart(): void {
    if (this.pendingAction()) {
      return;
    }

    this.runCartAction('clear', this.cartService.clearCart(), 'clear cart');
  }

  private runCartAction(
    action: string,
    request: Observable<CartActionResponse>,
    actionName: string,
  ): void {
    this.pendingAction.set(action);

    request
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((response) => this.toastr.success(response.message, 'FreshCart')),
        switchMap(() => this.cartService.getCart()),
        finalize(() => this.pendingAction.set(null)),
      )
      .subscribe({
        next: (response) => this.cart.set(response.data),
        error: (error: unknown) =>
          console.error(`Failed to ${actionName}.`, error),
      });
  }
}
