import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../core/constants/app-routes';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly routeLinks = APP_ROUTE_LINKS;
  protected isMenuOpen = false;
  private readonly platformId = inject(PLATFORM_ID)
  private readonly authService = inject(AuthService);
  loggedIn = computed(() => this.authService.isLoggedIn());

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if (localStorage.getItem('token')) {
      this.authService.isLoggedIn.set(true);
    }
    }

  }

  signOut(): void {
    this.authService.logout();
  }


}
