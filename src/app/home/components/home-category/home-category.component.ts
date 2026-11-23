import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';
import { catchError, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-home-category',
  imports: [RouterLink, SectionHeadingComponent],
  templateUrl: './home-category.component.html',
  styleUrl: './home-category.component.css',
})
export class HomeCategoryComponent {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly categoriesState = toSignal(
    this.categoriesService.getAllCategories().pipe(
      map((response) => ({
        status: 'loaded' as const,
        categories: response.data,
      })),
      startWith({ status: 'loading' as const }),
      catchError((error: unknown) => {
        console.error('Failed to load categories.', error);
        return of({ status: 'error' as const });
      }),
    ),
    { initialValue: { status: 'loading' as const } },
  );
}
