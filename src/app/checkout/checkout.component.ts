import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { CartService } from '../core/services/cart.service';
import { OrdersService } from '../core/services/orders.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly ordersService = inject(OrdersService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  protected selectedPayment = 'cash';
  protected cartTotal = signal<number | null>(null);
  protected cartId = '';
  protected isSubmitting = signal(false);
  protected readonly checkOut = this.formBuilder.group({
    shippingAddress: this.formBuilder.group({
      details: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
    }),
  });

  ngOnInit(): void {
    this.cartId = this.activatedRoute.snapshot.paramMap.get('id') ?? '';

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cartService
      .getCart()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.cartTotal.set(response.data.totalCartPrice);
        },
        error: (error: unknown) => {
          console.error('Failed to load checkout cart total.', error);
        },
      });
  }

  protected submitCheckout(): void {
    this.checkOut.markAllAsTouched();

    if (this.checkOut.invalid || this.isSubmitting()) {
      return;
    }

    if (!this.cartId) {
      this.toastr.error('Your cart could not be identified. Please return to your cart and try again.', 'FreshCart');
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const shippingAddress = this.checkOut.getRawValue().shippingAddress;
    const paymentMethod = this.selectedPayment;
    const request =
      paymentMethod === 'cash'
        ? this.ordersService.createCashOrder(this.cartId, shippingAddress)
        : this.ordersService.createCheckoutSession(
            this.cartId,
            shippingAddress,
            window.location.origin,
          );

    this.isSubmitting.set(true);

    request
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (response) => {
          if (paymentMethod === 'cash') {
            this.cartService.resetItemCount();
            this.toastr.success('Your order has been placed.', 'FreshCart');
            void this.router.navigate(['/allorders']);
            return;
          }

          if (!response.session?.url) {
            console.error('Checkout session response did not contain a payment URL.');
            this.toastr.error('The payment page could not be opened. Please try again.', 'FreshCart');
            return;
          }

          window.location.assign(response.session.url);
        },
        error: (error: unknown) => {
          console.error('Failed to submit checkout.', error);
        },
      });
  }
}
