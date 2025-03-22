import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from './components/menu/menu.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import { OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; 
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports:[CommonModule, RouterOutlet, MenuComponent, FooterComponent, HeaderComponent]
})

export class AppComponent implements OnInit {
  title = "ProjetWeb";
  isLoginPage: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.urlAfterRedirects === '/connexion';
      }
    });
  }

  logout() {
    console.log("Déconnexion");
    this.authService.logout();
    this.router.navigate(['/connexion']);
  }
}
