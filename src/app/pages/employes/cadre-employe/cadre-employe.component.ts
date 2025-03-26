import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { Employes } from '../../../models/employes.interface';
import { EmployeService } from '../../../services/employe.service';

@Component({
  selector: 'app-cadre-employe',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './cadre-employe.component.html',
  styleUrls: ['./cadre-employe.component.css']
})
export class CadreEmployeComponent implements OnInit {
  @Input() employes!: Employes[];
  isLoading = true;
  filteredEmployees: Employes[] = [];
  isDeletePopupOpen: boolean = false;
  delEmployee: any = null;

  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  isEditEmployeePopupOpen = false;
  editEmployee: Employes = { identifiant: 0, nom: '', prenom: '', date_entree: new Date(), competences: [''] };

  constructor(private employeService: EmployeService) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  // Méthode pour récupérer la liste des employés depuis le service
  fetchEmployees() {
    this.employeService.getEmployes().subscribe({
      next: data => {
        if (data && Array.isArray(data.employes)) {
          this.employes = data.employes.map((employe: any) => ({
            identifiant: employe.identifiant,
            nom: employe.nom,
            prenom: employe.prenom,
            date_entree: new Date(employe.date_entree),
            competences: employe.competences ? employe.competences.split(', ') : [],
            description: employe.description || 'Pas de description disponible.'
          }));
          this.filteredEmployees = [...this.employes]; // Initialise la liste des employés filtrés
        } else {
          console.error("Les données des employés ne sont pas un tableau :", data.employes);
          this.employes = [];
        }
        if (data.competences) {
          this.competences = data.competences; // Stocke la liste des compétences
        }
        this.isLoading = false; // Désactive l'indicateur de chargement
      },
      error: error => {
        console.error('Erreur :', error);
        this.isLoading = false;
      }
    });
  }

  // Méthode pour filtrer les employés en fonction d'un terme de recherche
  filterEmployees(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredEmployees = this.employes.filter((employe) =>
      `${employe.nom} ${employe.prenom}`.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  // Ouvre la pop-up de confirmation pour supprimer un employé
  openDeleteEmployeePopup(employee: Employes) {
    this.delEmployee = { ...employee }; // Stocke les informations de l'employé à supprimer
    this.isDeletePopupOpen = true;
  }

// Ferme la pop-up de suppression
  closeDeleteEmployeePopup() {
    this.isDeletePopupOpen = false;
  }

// Supprime un employé
  deleteEmployee() {
    if (this.delEmployee) {
      const identifiant = this.delEmployee.identifiant;  
      this.employeService.deleteEmploye(identifiant).subscribe({
        next: (response: string) => {          
          if (response === "Employé supprimé avec succès") {
            // Mise à jour de la liste des employés après suppression
            this.filteredEmployees = this.filteredEmployees.filter(emp => emp.identifiant !== identifiant);
            this.closeDeleteEmployeePopup();
            alert('Employé supprimé avec succès');
            this.fetchEmployees();// Rafraîchit la liste des employés
          } else {
            alert("Erreur lors de la suppression de l'employé.");
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'employé', error);
          alert('Erreur lors de la suppression de l\'employé');
        }
      });
    }
  }
  
  // Ouvre la pop-up d'édition d'un employé
  openEditEmployeePopup(employee: any) {
    this.editEmployee = {
      identifiant: employee.identifiant,
      nom: employee.nom,
      prenom: employee.prenom,
      date_entree: new Date(employee.date_entree),
      competences: employee.competences
    };
    // Récupère les codes de compétences correspondants
    this.competencesSelectionnees = employee.competences
      .map((desc: string) => {
        const found = this.competences.find(c => c.description_competence_fr === desc);
        return found ? found.code_skill : null;
      })
      .filter((skill: string | null): skill is string => skill !== null);
      this.isEditEmployeePopupOpen = true;
  }

  // Ferme la pop-up d'édition
  closeEditEmployeePopup() {
    this.isEditEmployeePopupOpen = false;
  }

  // Sauvegarde les modifications apportées à un employé
  saveEmployee() {
    const updatedEmployee = {
      identifiant: this.editEmployee.identifiant,
      nom: this.editEmployee.nom,
      prenom: this.editEmployee.prenom,
      date_entree: this.editEmployee.date_entree,
      competences: this.competencesSelectionnees
    };

    this.employeService.updateEmploye(updatedEmployee).subscribe({
      next: data => {
        console.log('Réponse du serveur:', data);
        this.fetchEmployees();// Rafraîchit la liste des employés après modification
        this.closeEditEmployeePopup();
      },
      error: error => {
        console.error('Erreur lors de la mise à jour de l\'employé :', error);
        alert("Erreur lors de la modification de l'employé.");
      }
    });
  }

 // Ajoute ou supprime une compétence de la liste des compétences sélectionnées
 toggleCompetence(code_skill: string) {
  if (this.competencesSelectionnees.includes(code_skill)) {
    // Si la compétence est déjà sélectionnée, on la retire
    this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
  } else {
    // Sinon, on l'ajoute à la liste
    this.competencesSelectionnees.push(code_skill);
  }
}
}
