import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiresLogin = route.data['requiresLogin']; // Verifica se a rota requer login
    const requiresAdmin = route.data['requiresAdmin']; // Verifica se a rota requer administração

    if (requiresLogin && !this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (requiresAdmin && !this.authService.isAdmin()) {
      this.router.navigateByUrl('/home');
      return false;
    }

    return true;
  }
}
