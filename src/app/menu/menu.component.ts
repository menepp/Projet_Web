import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  menuOpen = false;

  @Output() pageChange = new EventEmitter<string>(); // Événement pour notifier le parent de la page sélectionnée

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  navigateTo(page: string) {
    this.pageChange.emit(page); // Notifie le parent du changement de page
    this.menuOpen = false; // Ferme le menu après la navigation
  }
}
