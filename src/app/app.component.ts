// app.component.ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from './menu/menu.component';
import {AideComponent} from './aide/aide.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, AideComponent, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Notez le "styleUrls" (avec "s")
})
export class AppComponent {
  title = 'Projet-Web';
}
