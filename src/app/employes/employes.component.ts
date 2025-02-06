import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchBarComponent} from '../components/search-bar/search-bar.component';
import {FormsModule} from '@angular/forms';
import {AjouterComponent} from './ajouter/ajouter.component';
import {TrierComponent} from './trier/trier.component';
import {CadreEmployeComponent} from './cadre-employe/cadre-employe.component';


@Component({
  selector: 'app-employes',
  imports: [CommonModule, FormsModule, AjouterComponent, TrierComponent, CadreEmployeComponent],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent {
  employes: {
    identifiant: number;
    nom: string;
    prenom: string;
    poste: string;
    description: string;
    date_entree: Date;
    competences: string;
  }[] = [];
  isLoading = true;
  filteredEmployees: typeof this.employes = [];

  
}




