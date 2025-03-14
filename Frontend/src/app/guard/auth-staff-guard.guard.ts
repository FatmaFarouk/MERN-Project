import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStaffGuardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('stoken');
    if (!isLoggedIn) this.router.navigate(['/slogin']);
    return isLoggedIn;
  }
}

