import { Component } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { MenuComponent } from './menu/menu.component';
import { AideComponent } from './aide/aide.component';


@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, MenuComponent, AideComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Projet-Web';
}
