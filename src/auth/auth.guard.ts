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
      // Redireciona para a página de login se o usuário não estiver autenticado
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (requiresAdmin && !this.authService.isAdmin()) {
      // Redireciona para a página de acesso negado se o usuário não for admin
      this.router.navigateByUrl('/home');
      return false;
    }

    return true; // Permite acesso se não for necessário login ou admin, ou se o usuário estiver autenticado e for admin
  }
}
