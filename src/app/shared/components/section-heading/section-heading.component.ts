import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.component.html',
})
export class SectionHeadingComponent {
  readonly headingId = input.required<string>();
  readonly prefix = input.required<string>();
  readonly highlightedText = input.required<string>();
  readonly eyebrow = input('');
}
