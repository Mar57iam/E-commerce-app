import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, input, PLATFORM_ID, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { APP_ROUTE_LINKS } from '../../../core/constants/app-routes';
import { CartService } from '../../../core/services/cart.service';
import type { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  private readonly cartService = inject(CartService);
  private readonly toastr = inject(ToastrService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly product = input.required<Product>();
  protected readonly addingToCart = signal(false);

  protected productLink(id: string, slug: string): string {
    return APP_ROUTE_LINKS.productDetails(id, slug);
  }

  protected addToCart(): void {
    const product = this.product();

    if (
      this.addingToCart() ||
      !isPlatformBrowser(this.platformId) ||
      product.quantity <= 0
    ) {
      return;
    }

    if (!localStorage.getItem('token')) {
      this.toastr.warning(
        'Please sign in to add products to your cart.',
        'FreshCart',
      );
      return;
    }

    this.addingToCart.set(true);
    this.cartService
      .addProduct(product._id)
      .pipe(finalize(() => this.addingToCart.set(false)))
      .subscribe({
        next: (response) => this.toastr.success(response.message, 'FreshCart'),
        error: (error: unknown) =>
          console.error('Failed to add product to cart.', error),
      });
  }
}
