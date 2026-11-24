import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../core/constants/app-routes';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly routeLinks = APP_ROUTE_LINKS;
  protected readonly currentYear = new Date().getFullYear();
}
