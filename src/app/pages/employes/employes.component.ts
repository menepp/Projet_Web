import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { AjouterComponent } from './ajouter/ajouter.component';
import { TrierComponent } from './trier/trier.component';
import { CadreEmployeComponent } from './cadre-employe/cadre-employe.component';
import { EmployeInscription } from '../../models/employes.interface';

@Component({
  selector: 'app-employes',
  imports: [CommonModule, FormsModule, AjouterComponent, TrierComponent, CadreEmployeComponent],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css'],
  standalone: true
})
export class EmployeComponent implements OnInit {
  // Utilisation du type EmployeInscription[]
  employes: EmployeInscription[] = [];
  isLoading = true;
  filteredEmployees: EmployeInscription[] = [];

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.isLoading = true;
    console.log("📡 EmployeComponent : Récupération des employés...");
    fetch('http://localhost:3000/api/employes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des employés');
        }
        return response.json();
      })
      .then(data => {
        console.log("📥 Employés récupérés dans EmployeComponent :", data);
        // Adapter la structure pour qu'elle corresponde à EmployeInscription
        this.employes = data.employes.map((emp: any) => ({
          identifiant: emp.identifiant,
          nom: emp.nom,
          prenom: emp.prenom,
          email: emp.email,               // Ajout de l'email
          mot_de_passe: emp.mot_de_passe, // Ajout du mot de passe
          role_employe: emp.role_employe, // Ajout du role
          date_entree: new Date(emp.date_entree),
          competences: emp.competences ? emp.competences.split(', ') : []
        }));
        this.filteredEmployees = [...this.employes];
        this.isLoading = false;
      })
      .catch(error => {
        console.error("❌ Erreur dans fetchEmployees:", error);
        this.isLoading = false;
      });
  }

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
