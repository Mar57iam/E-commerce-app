import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, forkJoin, map, of, startWith } from 'rxjs';
import { CategoriesService } from '../core/services/categories.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly selectedCategoryId = signal<string | null>(null);
  protected readonly directoryState = toSignal(
    forkJoin({
      categories: this.categoriesService.getAllCategories(),
      subcategories: this.categoriesService.getAllSubcategories(),
    }).pipe(
      map(({ categories, subcategories }) => ({
        status: 'loaded' as const,
        categories: categories.data,
        subcategories: subcategories.data,
      })),
      startWith({ status: 'loading' as const }),
      catchError((error: unknown) => {
        console.error('Failed to load categories and subcategories.', error);
        return of({ status: 'error' as const });
      }),
    ),
    { initialValue: { status: 'loading' as const } },
  );
  protected readonly selectedCategory = computed(() => {
    const state = this.directoryState();
    if (state.status !== 'loaded') {
      return null;
    }

    return (
      state.categories.find(
        (category) => category._id === this.selectedCategoryId(),
      ) ??
      state.categories[0] ??
      null
    );
  });
  protected readonly activeSubcategories = computed(() => {
    const state = this.directoryState();
    const category = this.selectedCategory();

    return state.status === 'loaded' && category
      ? state.subcategories.filter(
          (subcategory) => subcategory.category === category._id,
        )
      : [];
  });

  protected selectCategory(categoryId: string): void {
    this.selectedCategoryId.set(categoryId);
  }
}
