import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';
import { ProductsService } from '../core/services/products.service';
import { ProductCardComponent } from '../shared/components/product-card/product-card.component';
import { SectionHeadingComponent } from '../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-shop',
  imports: [ProductCardComponent, SectionHeadingComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly productsState = toSignal(
    this.productsService.getAllProducts().pipe(
      map((response) => ({
        status: 'loaded' as const,
        products: response.data,
      })),
      startWith({ status: 'loading' as const }),
      catchError((error: unknown) => {
        console.error('Failed to load shop products.', error);
        return of({ status: 'error' as const });
      }),
    ),
    { initialValue: { status: 'loading' as const } },
  );
}
