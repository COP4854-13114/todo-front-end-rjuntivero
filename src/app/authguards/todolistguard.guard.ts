import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const todolistGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);

  const router = inject(Router);
  if (authSvc.TokenSignal()) {
    return true;
  } else {
    alert('You must be logged in to access this page');
    router.navigate(['/login']);
  }
  return false;
};
