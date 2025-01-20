import { Component } from '@angular/core';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

import { MenuComponent } from './menu/menu.component';
import { AideComponent } from './aide/aide.component';
import { EmployesComponent } from './employes/employes.component';
import { MissionComponent } from './mission/mission.component';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [SearchBarComponent, MenuComponent, AideComponent, EmployesComponent,MissionComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Projet-Web';
  currentPage = 'accueil'; // Par défaut, on affiche l'accueil

  onPageChange(page: string) {
    this.currentPage = page; // Met à jour la page active
  }
}
