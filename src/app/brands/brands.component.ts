import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  map,
  of,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';
import { BrandsService } from '../core/services/brands.service';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css',
})
export class BrandsComponent {
  private readonly brandsService = inject(BrandsService);
  private readonly selectedBrandId = new Subject<string | null>();

  protected readonly brandsState = toSignal(
    this.brandsService.getAllBrands().pipe(
      map((response) => ({
        status: 'loaded' as const,
        brands: response.data,
      })),
      startWith({ status: 'loading' as const }),
      catchError((error: unknown) => {
        console.error('Failed to load brands.', error);
        return of({ status: 'error' as const });
      }),
    ),
    { initialValue: { status: 'loading' as const } },
  );
  protected readonly selectedBrandState = toSignal(
    this.selectedBrandId.pipe(
      switchMap((brandId) => {
        if (!brandId) {
          return of({ status: 'closed' as const });
        }

        return this.brandsService.getSpecificBrand(brandId).pipe(
          map((response) => ({
            status: 'loaded' as const,
            brand: response.data,
          })),
          startWith({ status: 'loading' as const }),
          catchError((error: unknown) => {
            console.error(`Failed to load brand ${brandId}.`, error);
            return of({ status: 'error' as const });
          }),
        );
      }),
    ),
    { initialValue: { status: 'closed' as const } },
  );

  protected viewBrand(brandId: string): void {
    this.selectedBrandId.next(brandId);
  }

  protected closeBrandDetails(): void {
    this.selectedBrandId.next(null);
  }
}
