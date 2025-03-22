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

  fetchEmployees() {
    this.employeService.getEmployes().subscribe({
      next: data => {
        console.log("Données des employés reçues :", data);
        if (data && Array.isArray(data.employes)) {
          this.employes = data.employes.map((employe: any) => ({
            identifiant: employe.identifiant,
            nom: employe.nom,
            prenom: employe.prenom,
            date_entree: new Date(employe.date_entree),
            competences: employe.competences ? employe.competences.split(', ') : [],
            description: employe.description || 'Pas de description disponible.'
          }));
          this.filteredEmployees = [...this.employes];
        } else {
          console.error("Les données des employés ne sont pas un tableau :", data.employes);
          this.employes = [];
        }
        if (data.competences) {
          this.competences = data.competences;
        }
        this.isLoading = false;
      },
      error: error => {
        console.error('Erreur :', error);
        this.isLoading = false;
      }
    });
  }

  filterEmployees(searchTerm: string) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    this.filteredEmployees = this.employes.filter((employe) =>
      `${employe.nom} ${employe.prenom}`.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  openDeleteEmployeePopup(employee: Employes) {
    this.delEmployee = { ...employee };
    this.isDeletePopupOpen = true;
  }

  closeDeleteEmployeePopup() {
    this.isDeletePopupOpen = false;
  }

  deleteEmployee() {
    if (this.delEmployee) {
      const identifiant = this.delEmployee.identifiant;
      console.log('Suppression de l\'employé avec l\'identifiant:', identifiant);
  
      this.employeService.deleteEmploye(identifiant).subscribe({
        next: (response: string) => {
          console.log('Réponse du serveur:', response);
          
          if (response === "Employé supprimé avec succès") {
            this.filteredEmployees = this.filteredEmployees.filter(emp => emp.identifiant !== identifiant);
            this.closeDeleteEmployeePopup();
  
            alert('Employé supprimé avec succès');
            this.fetchEmployees();
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
  
  openEditEmployeePopup(employee: any) {
    this.editEmployee = {
      identifiant: employee.identifiant,
      nom: employee.nom,
      prenom: employee.prenom,
      date_entree: new Date(employee.date_entree),
      competences: employee.competences
    };
    this.competencesSelectionnees = employee.competences
      .map((desc: string) => {
        const found = this.competences.find(c => c.description_competence_fr === desc);
        return found ? found.code_skill : null;
      })
      .filter((skill: string | null): skill is string => skill !== null);
  
    console.log("Compétences sélectionnées (code_skill) :", this.competencesSelectionnees);
    this.isEditEmployeePopupOpen = true;
  }

  closeEditEmployeePopup() {
    this.isEditEmployeePopupOpen = false;
  }

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
        this.fetchEmployees();
        this.closeEditEmployeePopup();
      },
      error: error => {
        console.error('Erreur lors de la mise à jour de l\'employé :', error);
        alert("Erreur lors de la modification de l'employé.");
      }
    });
  }

  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log("Compétences sélectionnées :", this.competencesSelectionnees);
  }
}
