import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { SectionHeadingComponent } from '../../../shared/components/section-heading/section-heading.component';

@Component({
  selector: 'app-home-category',
  imports: [RouterLink, SectionHeadingComponent],
  templateUrl: './home-category.component.html',
  styleUrl: './home-category.component.css',
})
export class HomeCategoryComponent {
  private readonly categoriesService = inject(CategoriesService);

  protected readonly categoriesResponse = toSignal(
    this.categoriesService.getAllCategories(),
    { initialValue: null },
  );
}
