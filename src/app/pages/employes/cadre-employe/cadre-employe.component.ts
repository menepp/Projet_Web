
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { Employes } from '../../../models/employes.interface';

@Component({
  selector: 'app-cadre-employe',
  imports: [CommonModule, FormsModule, SearchBarComponent],
  templateUrl: './cadre-employe.component.html',
  styleUrl: './cadre-employe.component.css'
})

export class CadreEmployeComponent implements OnInit {
  @Input() employes!: Employes[];
  isLoading = true;
  selectedEmployee: any = null;
  delEmployee: any = null;
  filteredEmployees: Employes[] = [];
  isDeletePopupOpen: boolean = false;

  competences: { code_skill: string, description_competence_fr: string }[] = [];
  competencesSelectionnees: string[] = [];

  isEditEmployeePopupOpen = false;
  editEmployee: Employes = { identifiant: 0, nom: '', prenom: '', date_entree: new Date(), competences: '' };

  ngOnInit(): void {
    this.fetchEmployees();
  }
  fetchEmployees() {
    fetch('http://localhost:3000/api/employes')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des employés');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Données des employés reçues : ", data);

        if (data && Array.isArray(data.employes)) {
          this.employes = data.employes.map((employe: any) => ({
            identifiant: employe.identifiant,
            nom: employe.nom,
            prenom: employe.prenom,
            date_entree: employe.date_entree,
            competences: employe.competences ? employe.competences.split(', ') : [], 
            description: employe.description || 'Pas de description disponible.',
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
      })
      .catch((error) => {
        console.error('Erreur :', error);
        this.isLoading = false;
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
    console.log('Tentative de suppression avec ID :', this.delEmployee.identifiant);
    fetch(`http://localhost:3000/api/employes/${this.delEmployee.identifiant}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur lors de la suppression de l\'employé 1 ');
        }
        this.employes = this.employes.filter((employe) => employe.identifiant !== this.delEmployee.identifiant);
        this.filteredEmployees = [...this.employes];
        alert('Employé supprimé avec succès.');
      })
      .catch((error) => {
        console.error('Erreur :', error);
        alert('Erreur lors de la suppression de l\'employé 2 .');
      });
    this.closeDeleteEmployeePopup();
  }

  openEditEmployeePopup(employee: any) {
    this.editEmployee = {
      identifiant: employee.identifiant,
      nom: employee.nom,
      prenom: employee.prenom,
      date_entree: employee.date_entree,
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
    
    fetch(`http://localhost:3000/api/employes/${this.editEmployee.identifiant}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: this.editEmployee.nom,
        prenom: this.editEmployee.prenom,
        date_entree: this.editEmployee.date_entree,
        competences: this.competencesSelectionnees, 
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Réponse du serveur:', data);
      this.fetchEmployees();
      this.closeEditEmployeePopup();
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour de l\'employé :', error);
      alert('Erreur lors de la modification de l\'employé.');
    });
  }
  
  toggleCompetence(code_skill: string) {
    if (this.competencesSelectionnees.includes(code_skill)) {
      this.competencesSelectionnees = this.competencesSelectionnees.filter(c => c !== code_skill);
    } else {
      this.competencesSelectionnees.push(code_skill);
    }
    console.log(" Compétences sélectionnées (identifiants) :", this.competencesSelectionnees);
  }
  
}