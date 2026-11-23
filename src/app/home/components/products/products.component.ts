import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../core/constants/app-routes';
import { ProductsService } from '../../../core/services/products.service';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { catchError, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [RouterLink, SectionHeadingComponent, ProductCardComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly shopLink = APP_ROUTE_LINKS.shop;
  protected readonly productsState = toSignal(
    this.productsService.getAllProducts().pipe(
      map((response) => ({
        status: 'loaded' as const,
        products: response.data,
      })),
      startWith({ status: 'loading' as const }),
      catchError((error: unknown) => {
        console.error('Failed to load featured products.', error);
        return of({ status: 'error' as const });
      }),
    ),
    { initialValue: { status: 'loading' as const } },
  );
}
