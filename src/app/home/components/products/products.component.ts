import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../core/constants/app-routes';
import { ProductsService } from '../../../core/services/products.service';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, RouterLink, SectionHeadingComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  private readonly productsService = inject(ProductsService);

  protected readonly shopLink = APP_ROUTE_LINKS.shop;
  protected readonly productsResponse = toSignal(
    this.productsService.getAllProducts(),
    { initialValue: null },
  );

  protected productLink(id: string, slug: string): string {
    return APP_ROUTE_LINKS.productDetails(id, slug);
  }
}
