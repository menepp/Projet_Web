import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;
  private user: any = null;

  login(user: any) {
    this.authenticated = true;
    this.user = user;
  }

  logout() {
    this.authenticated = false;
    this.user = null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getUser() {
    return this.user;
  }
}
