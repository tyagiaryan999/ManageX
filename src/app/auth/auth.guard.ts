import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  // alert(useremail);
  if (user) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/']);
    return false;
  }
};
