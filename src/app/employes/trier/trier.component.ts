import { Component,EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trier',
  imports: [FormsModule],
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
  @Output() sortChanged = new EventEmitter<string>();
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
    this.sortChanged.emit(this.sortBy);
    this.closeSortPopup();
  
  }
  
}
