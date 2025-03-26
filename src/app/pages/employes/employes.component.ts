import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { AjouterComponent } from './ajouter/ajouter.component';
import { TrierComponent } from './trier/trier.component';
import { CadreEmployeComponent } from './cadre-employe/cadre-employe.component';
import { EmployeInscription } from '../../models/employes.interface';
import { EmployeService } from '../../services/employe.service';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, AjouterComponent, TrierComponent, CadreEmployeComponent],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployeComponent implements OnInit {
  employes: EmployeInscription[] = [];
  isLoading = true;
  filteredEmployees: EmployeInscription[] = [];

  constructor(private employeService: EmployeService) {}

  ngOnInit(): void {
    this.fetchEmployees(); // Appelle la fonction pour récupérer la liste des employés
  }

  // Fonction permettant de récupérer la liste des employés depuis le service
  fetchEmployees() {
    this.isLoading = true; // Active l'indicateur de chargement
    this.employeService.getEmployes().subscribe({ // Appel API pour récupérer les employés
      next: data => { // Callback en cas de succès
        // Transformation des données reçues pour correspondre à l'interface EmployeInscription
        this.employes = data.employes.map((emp: any) => ({
          identifiant: emp.identifiant,
          nom: emp.nom,
          prenom: emp.prenom,
          email: emp.email,
          mot_de_passe: emp.mot_de_passe,
          role_employe: emp.role_employe,
          date_entree: new Date(emp.date_entree), // Conversion de la date en objet Date
          competences: emp.competences ? emp.competences.split(', ') : [] // Conversion des compétences en tableau
        }));

        this.filteredEmployees = [...this.employes]; // Copie des employés pour le tri/filtrage
        this.isLoading = false; // Désactive l'indicateur de chargement
      },
      error: error => { // Callback en cas d'erreur
        console.error("❌ Erreur dans fetchEmployees:", error);
        this.isLoading = false; // Désactive l'indicateur de chargement même en cas d'erreur
      }
    });
  }

  // Fonction permettant de trier la liste des employés selon un critère donné
  onSortChanged(criterion: string) {
    if (criterion === 'nom') {
      // Trie les employés par nom dans l'ordre alphabétique
      this.filteredEmployees.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (criterion === 'prenom') {
      // Trie les employés par prénom dans l'ordre alphabétique
      this.filteredEmployees.sort((a, b) => a.prenom.localeCompare(b.prenom));
    } else if (criterion === 'date_entree') {
      // Trie les employés par date d'entrée dans l'entreprise (ordre chronologique)
      this.filteredEmployees.sort((a, b) => a.date_entree.getTime() - b.date_entree.getTime());
    }
  }
}
