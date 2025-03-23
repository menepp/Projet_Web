import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MenuComponent } from './components/menu/menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent, HeaderComponent]
})
export class AppComponent implements OnInit {
  title = "ProjetWeb";
  isLoginPage: boolean = false;
  currentUrl: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects === '/connexion';
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  // Méthode qui détermine si le menu doit être affiché
  showMenu(): boolean {
    // Ne pas afficher le menu sur la page de connexion
    if (this.isLoginPage) {
      return false;
    }
    // Si l'URL est "/salon" et que l'utilisateur est un Employé, ne pas afficher le menu
    if (this.currentUrl === '/salon') {
      const user = this.authService.getUser();
      if (user && user.role_employe === 'Employé') {
        return false;
      }
    }
    return true;
  }

  logout() {
    console.log("Déconnexion");
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
