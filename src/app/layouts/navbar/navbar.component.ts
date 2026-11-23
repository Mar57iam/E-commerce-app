import { Component, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTE_LINKS } from '../../core/constants/app-routes';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly routeLinks = APP_ROUTE_LINKS;
  protected isMenuOpen = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  protected readonly cartItemCount = this.cartService.itemCount;
  loggedIn = computed(() => this.authService.isLoggedIn());
  private readonly cartCountEffect = effect((onCleanup) => {
    if (
      !isPlatformBrowser(this.platformId) ||
      !this.authService.isLoggedIn()
    ) {
      this.cartService.resetItemCount();
      return;
    }

    const subscription = this.cartService.getCart().subscribe({
      error: (error: unknown) =>
        console.error('Failed to load cart item count.', error),
    });

    onCleanup(() => subscription.unsubscribe());
  });

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('token')) {
        this.authService.isLoggedIn.set(true);
      }
    }
  }

  signOut(): void {
    this.authService.logout();
  }


}
