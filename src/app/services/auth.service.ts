import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticated = false;
  private user: any = null;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.authenticated = true;
    }
  }

  login(user: any) {
    this.authenticated = true;
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.authenticated = false;
    this.user = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getUser() {
    return this.user;
  }
}
