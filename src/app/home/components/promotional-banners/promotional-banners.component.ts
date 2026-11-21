import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../../core/constants/app-routes';

@Component({
  selector: 'app-promotional-banners',
  imports: [RouterLink],
  templateUrl: './promotional-banners.component.html',
})
export class PromotionalBannersComponent {
  protected readonly shopLink = APP_ROUTE_LINKS.shop;
}
