import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // orders  - checkouts - wishlist - cart
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
    if(isPlatformBrowser(platformId)){
      if (!localStorage.getItem('token')) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    }
    else{
      return true;
    }
};
