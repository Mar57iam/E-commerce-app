import { CurrencyPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../core/services/products.service';
import { Product } from '../core/models/product.model';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly product = signal<Product | null>(null);
  protected readonly selectedImage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly mainImage = computed(
    () => this.selectedImage() ?? this.product()?.imageCover ?? '',
  );

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const productId = params.get('id');
        if (productId) {
          this.getProductDetails(productId);
        } else {
          this.errorMessage.set('Product ID was not provided.');
        }
      });
  }

  getProductDetails(productId: string): void {
    this.product.set(null);
    this.selectedImage.set(null);
    this.errorMessage.set(null);

    this.productsService.getSpecificProduct(productId).subscribe({
      next: (response) => this.product.set(response.data),
      error: () => this.errorMessage.set('Unable to load product details.'),
    });
  }
}
