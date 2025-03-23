import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/connexion']);
      return false;
    }
    const user = this.authService.getUser();
    const requiredRole = route.data['role']; 

    if (requiredRole && user.role_employe !== requiredRole) {
      if (user.role_employe === 'Employé') {
        this.router.navigate(['/salon']);
        return false;
      } else {
        this.router.navigate(['/accueil']);
        return false;
      }
    }
    return true;
  }
}
