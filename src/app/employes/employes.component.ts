import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchBarComponent} from '../components/search-bar/search-bar.component';
import {FormsModule} from '@angular/forms';
import {AjouterComponent} from './ajouter/ajouter.component';
import {TrierComponent} from './trier/trier.component';
import {CadreEmployeComponent} from './cadre-employe/cadre-employe.component';
import { Employes } from '../models/employes.interface';

@Component({
  selector: 'app-employes',
  imports: [CommonModule, FormsModule, AjouterComponent, TrierComponent, CadreEmployeComponent],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent {
  employes: Employes[] = [];
  isLoading = true;
  filteredEmployees: typeof this.employes = [];

  onSortChanged(criterion: string) {
    console.log(`Tri par : ${criterion}`);

    if (criterion === 'nom') {
      this.filteredEmployees.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (criterion === 'prenom') {
      this.filteredEmployees.sort((a, b) => a.prenom.localeCompare(b.prenom));
    } else if (criterion === 'date_entree') {
      this.filteredEmployees.sort((a, b) => a.date_entree.getTime() - b.date_entree.getTime());
    }
  }
}





