import { Component } from '@angular/core';

@Component({
  selector: 'app-trier',
  imports: [],
  templateUrl: './trier.component.html',
  styleUrl: './trier.component.css'
})
export class TrierComponent {
  employes: {
    identifiant: number;
    nom: string;
    prenom: string;
    poste: string;
    description: string;
    date_entree: Date;
    competences: string;
  }[] = [];
  isSortPopupOpen: boolean = false;
  sortBy: string = '';

  openSortPopup() {
    this.isSortPopupOpen = true;
  }

  closeSortPopup() {
    this.isSortPopupOpen = false;
  }

  setSortBy(criterion: string) {
    this.sortBy = criterion;
  }

  applySort() {
    if (this.sortBy === 'nom') {
      this.employes.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (this.sortBy === 'prenom') {
      this.employes.sort((a, b) => a.prenom.localeCompare(b.prenom));
    } else if (this.sortBy === 'date_entree') {
      this.employes.sort((a, b) => new Date(a.date_entree).getTime() - new Date(b.date_entree).getTime());
    }
    this.closeSortPopup();
  }
}
